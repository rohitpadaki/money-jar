package com.tarungattu.moneyjar.controllers.transactionsummary;

import com.tarungattu.moneyjar.security.UserDetailsImpl;
import com.tarungattu.moneyjar.services.transactionsummary.TransactionSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions/summary")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionSummaryController {

    @Autowired
    private TransactionSummaryService summaryService;

    private java.util.UUID getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        return ResponseEntity.ok(summaryService.getTotalBalance(getUserId()));
    }

    @GetMapping("/by-type")
    public ResponseEntity<?> getByType() {
        return ResponseEntity.ok(summaryService.getTotalByType(getUserId()));
    }

    @GetMapping("/by-category")
    public ResponseEntity<?> getByCategory() {
        return ResponseEntity.ok(summaryService.getTotalByCategory(getUserId()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthly() {
        return ResponseEntity.ok(summaryService.getMonthlySummary(getUserId()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeekly() {
        return ResponseEntity.ok(summaryService.getWeeklySummary(getUserId()));
    }

    @GetMapping("/expenses-by-category")
    public ResponseEntity<?> getExpensesByCategory() {
        return ResponseEntity.ok(summaryService.getExpensesByCategory(getUserId()));
    }

    @GetMapping("/incomes-by-category")
    public ResponseEntity<?> getIncomesByCategory() {
        return ResponseEntity.ok(summaryService.getIncomesByCategory(getUserId()));
    }
}
