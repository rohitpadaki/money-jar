package com.tarungattu.moneyjar.controllers.payment;

import com.tarungattu.moneyjar.dto.CreatePaymentDto;
import com.tarungattu.moneyjar.models.Payment;
import com.tarungattu.moneyjar.security.UserDetailsImpl;
import com.tarungattu.moneyjar.services.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/groups/{groupId}/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> create(@PathVariable UUID groupId, @RequestBody CreatePaymentDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(paymentService.createPayment(userDetails.getId(), groupId, dto));
    }

    @GetMapping
    public ResponseEntity<?> list(
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(paymentService.listPayments(groupId, limit, offset));
    }

    @GetMapping("/balances/settle")
    public ResponseEntity<?> settle(@PathVariable UUID groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(paymentService.computeBalances(userDetails.getId(), groupId));
    }
}
