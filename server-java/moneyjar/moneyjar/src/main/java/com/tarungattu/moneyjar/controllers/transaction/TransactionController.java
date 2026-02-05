package com.tarungattu.moneyjar.controllers.transaction;

import com.tarungattu.moneyjar.dto.CreateTransactionDto;
import com.tarungattu.moneyjar.dto.UpdateTransactionDto;
import com.tarungattu.moneyjar.security.UserDetailsImpl;
import com.tarungattu.moneyjar.services.transaction.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<?> findAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal(); // Assuming auth principle is UserDetailsImpl
        return ResponseEntity.ok(transactionService.findAllByUser(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findOne(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(transactionService.findOneByUser(id, userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateTransactionDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(transactionService.create(userDetails.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UpdateTransactionDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(transactionService.updateTransaction(id, userDetails.getId(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        transactionService.remove(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
