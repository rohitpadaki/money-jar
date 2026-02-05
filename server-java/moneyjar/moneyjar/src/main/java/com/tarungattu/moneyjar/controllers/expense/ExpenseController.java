package com.tarungattu.moneyjar.controllers.expense;

import com.tarungattu.moneyjar.dto.CreateExpenseDto;
import com.tarungattu.moneyjar.models.Expense;
import com.tarungattu.moneyjar.security.UserDetailsImpl;
import com.tarungattu.moneyjar.services.expense.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/groups/{groupId}/expenses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> create(@PathVariable UUID groupId, @RequestBody CreateExpenseDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(expenseService.createExpense(userDetails.getId(), groupId, dto));
    }

    @GetMapping
    public ResponseEntity<?> list(
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(expenseService.listExpenses(groupId, limit, offset));
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<?> getOne(@PathVariable UUID groupId, @PathVariable UUID expenseId) {
        // Note: groupId path variable not strictly used if ID is unique, but good for validation if needed.
        return ResponseEntity.ok(expenseService.getExpenseById(expenseId));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> delete(@PathVariable UUID groupId, @PathVariable UUID expenseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        expenseService.deleteExpense(userDetails.getId(), expenseId);
        return ResponseEntity.ok().body("{\"success\": true}");
    }
}
