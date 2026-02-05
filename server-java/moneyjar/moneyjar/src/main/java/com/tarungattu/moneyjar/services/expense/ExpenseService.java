package com.tarungattu.moneyjar.services.expense;

import com.tarungattu.moneyjar.dto.CreateExpenseDto;
import com.tarungattu.moneyjar.enums.SplitType;
import com.tarungattu.moneyjar.models.Expense;
import com.tarungattu.moneyjar.models.ExpenseParticipant;
import com.tarungattu.moneyjar.models.Group;
import com.tarungattu.moneyjar.models.GroupMember;
import com.tarungattu.moneyjar.models.User;
import com.tarungattu.moneyjar.repository.ExpenseParticipantRepository;
import com.tarungattu.moneyjar.repository.ExpenseRepository;
import com.tarungattu.moneyjar.repository.GroupRepository;
import com.tarungattu.moneyjar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseParticipantRepository expenseParticipantRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Expense createExpense(UUID requestorId, UUID groupId, CreateExpenseDto dto) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Ensure requestor is member
        boolean isMember = group.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(requestorId));
        if (!isMember) {
            throw new RuntimeException("Only group members can create expenses");
        }

        List<User> participantUsers = new ArrayList<>();
        if (dto.getSplitType() == SplitType.ALL) {
            participantUsers = group.getMembers().stream()
                    .map(GroupMember::getUser)
                    .collect(Collectors.toList());
        } else {
            // SELECTED
            if (dto.getParticipants() == null || dto.getParticipants().isEmpty()) {
                throw new RuntimeException("Participants required for SELECTED split");
            }
            List<UUID> memberIds = group.getMembers().stream()
                    .map(m -> m.getUser().getId())
                    .collect(Collectors.toList());
            
            for (UUID pid : dto.getParticipants()) {
                if (!memberIds.contains(pid)) {
                    throw new RuntimeException("User " + pid + " is not a member of group");
                }
            }
            participantUsers = userRepository.findAllById(dto.getParticipants());
        }

        if (participantUsers.isEmpty()) {
            throw new RuntimeException("No participants provided for split");
        }

        User payer = userRepository.findById(requestorId)
                .orElseThrow(() -> new RuntimeException("Payer not found"));

        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setPayer(payer);
        expense.setAmount(dto.getAmount());
        expense.setNote(dto.getNote());
        expense.setSplitType(dto.getSplitType());
        
        expense = expenseRepository.save(expense);

        // Sort users deterministically (by ID)
        participantUsers.sort(Comparator.comparing(User::getId));

        // Distribute amount
        long totalCents = dto.getAmount().multiply(new BigDecimal("100")).setScale(0, RoundingMode.HALF_UP).longValue();
        int n = participantUsers.size();
        long baseShare = totalCents / n;
        long remainder = totalCents % n;

        List<ExpenseParticipant> participants = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            long shareCents = baseShare;
            if (remainder > 0) {
                shareCents++;
                remainder--;
            }
            
            BigDecimal share = new BigDecimal(shareCents).divide(new BigDecimal("100"), 2, RoundingMode.UNNECESSARY);
            
            ExpenseParticipant ep = new ExpenseParticipant();
            ep.setExpense(expense);
            ep.setUser(participantUsers.get(i));
            ep.setShare(share);
            
            participants.add(ep);
        }
        
        expenseParticipantRepository.saveAll(participants);
        expense.setParticipants(participants); // Update local object
        
        return expense;
    }

    @Transactional(readOnly = true)
    public List<Expense> listExpenses(UUID groupId, int limit, int offset) {
         // Pagination implementation is optional but good practice.
         // For now, simpler implementation: fetch all and stream skip/limit or use Pageable
         // Since I use repo interfaces extending JpaRepository, I can use PageRequest
         // But NestJS implementation was manual skip/take.
         // Let's keep it simple: findAll by Group and manually limit or better, add findByGroup to repo with Pageable.
         // I'll assume standard findByGroup for now and stream. 
         // Actually, if list is huge, this is bad. But for MVP OK.
         // NestJS: order: { createdAt: 'DESC' }
         
         List<Expense> all = expenseRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
         return all.stream().skip(offset).limit(limit).collect(Collectors.toList());
    }

    public Expense getExpenseById(UUID expenseId) {
        return expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public void deleteExpense(UUID requestorId, UUID expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getPayer().getId().equals(requestorId)) {
            throw new RuntimeException("Only payer can delete the expense");
        }
        
        expenseRepository.delete(expense);
    }
}
