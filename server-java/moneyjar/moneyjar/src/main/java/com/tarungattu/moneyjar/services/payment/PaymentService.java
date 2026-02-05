package com.tarungattu.moneyjar.services.payment;

import com.tarungattu.moneyjar.dto.CreatePaymentDto;
import com.tarungattu.moneyjar.models.Group;
import com.tarungattu.moneyjar.models.GroupMember;
import com.tarungattu.moneyjar.models.Payment;
import com.tarungattu.moneyjar.models.User;
import com.tarungattu.moneyjar.repository.ExpenseParticipantRepository;
import com.tarungattu.moneyjar.repository.GroupRepository;
import com.tarungattu.moneyjar.repository.PaymentRepository;
import com.tarungattu.moneyjar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseParticipantRepository expenseParticipantRepository;

    @Transactional
    public Payment createPayment(UUID requestorId, UUID groupId, CreatePaymentDto dto) {
        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<UUID> memberIds = group.getMembers().stream()
                .map(m -> m.getUser().getId())
                .collect(Collectors.toList());

        if (!memberIds.contains(dto.getToUserId())) {
            throw new RuntimeException("toUser is not a member of the group");
        }
        if (!memberIds.contains(requestorId)) {
            throw new RuntimeException("From user must be a group member");
        }

        User fromUser = userRepository.findById(requestorId).orElseThrow(() -> new RuntimeException("User not found"));
        User toUser = userRepository.findById(dto.getToUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = new Payment();
        payment.setGroup(group);
        payment.setFromUser(fromUser);
        payment.setToUser(toUser);
        payment.setAmount(dto.getAmount());
        payment.setNote(dto.getNote());

        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public List<Payment> listPayments(UUID groupId, int limit, int offset) {
        return paymentRepository.findByGroupIdOrderByDateDesc(groupId)
                .stream().skip(offset).limit(limit).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> computeBalances(UUID requestorId, UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<UUID> otherMemberIds = group.getMembers().stream()
                .map(m -> m.getUser().getId())
                .filter(id -> !id.equals(requestorId))
                .collect(Collectors.toList());

        // Prepare maps (cents)
        Map<UUID, Long> mapPaidByReq = new HashMap<>();
        Map<UUID, Long> mapPaidForReq = new HashMap<>();
        Map<UUID, Long> mapPaymentsFrom = new HashMap<>(); // From other TO req
        Map<UUID, Long> mapPaymentsTo = new HashMap<>();   // From req TO other

        // 1. Paid by requestor for others
        List<Object[]> paidByReqRows = expenseParticipantRepository.sumPaidByPayer(groupId, requestorId);
        for (Object[] row : paidByReqRows) {
            UUID userId = (UUID) row[0];
            BigDecimal share = (BigDecimal) row[1];
            mapPaidByReq.put(userId, share.multiply(new BigDecimal("100")).longValue());
        }

        // 2. Paid for requestor by others
        List<Object[]> paidForReqRows = expenseParticipantRepository.sumPaidForUser(groupId, requestorId);
        for (Object[] row : paidForReqRows) {
            UUID payerId = (UUID) row[0];
            BigDecimal share = (BigDecimal) row[1];
            mapPaidForReq.put(payerId, share.multiply(new BigDecimal("100")).longValue());
        }

        // 3. Payments involving requestor
        List<Object[]> paymentRows = paymentRepository.sumPaymentsInvolvingUser(groupId, requestorId);
        for (Object[] row : paymentRows) {
            UUID fromId = (UUID) row[0];
            UUID toId = (UUID) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            long cents = amount.multiply(new BigDecimal("100")).longValue();

            if (toId.equals(requestorId) && !fromId.equals(requestorId)) {
                mapPaymentsFrom.put(fromId, mapPaymentsFrom.getOrDefault(fromId, 0L) + cents);
            } else if (fromId.equals(requestorId) && !toId.equals(requestorId)) {
                mapPaymentsTo.put(toId, mapPaymentsTo.getOrDefault(toId, 0L) + cents);
            }
        }

        Map<String, BigDecimal> balances = new HashMap<>();
        BigDecimal totalOwedToRequestor = BigDecimal.ZERO;
        BigDecimal totalOwingByRequestor = BigDecimal.ZERO;

        for (UUID otherId : otherMemberIds) {
            long paidByReq = mapPaidByReq.getOrDefault(otherId, 0L);
            long paidForReq = mapPaidForReq.getOrDefault(otherId, 0L);
            long paymentsFromOther = mapPaymentsFrom.getOrDefault(otherId, 0L);
            long paymentsFromReq = mapPaymentsTo.getOrDefault(otherId, 0L);

            // Calculation formula from NestJS:
            // cents = paidByReq - paidForReq - paymentsFromOther + paymentsFromReq;
            long balanceCents = paidByReq - paidForReq - paymentsFromOther + paymentsFromReq;
            
            BigDecimal balance = new BigDecimal(balanceCents).divide(new BigDecimal("100"));
            balances.put(otherId.toString(), balance);

            if (balance.compareTo(BigDecimal.ZERO) > 0) {
                totalOwedToRequestor = totalOwedToRequestor.add(balance);
            } else {
                totalOwingByRequestor = totalOwingByRequestor.add(balance.abs());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("requestorId", requestorId.toString());
        result.put("groupId", groupId.toString());
        result.put("balances", balances);
        result.put("totalOwedToRequestor", totalOwedToRequestor);
        result.put("totalOwingByRequestor", totalOwingByRequestor);

        return result;
    }
}
