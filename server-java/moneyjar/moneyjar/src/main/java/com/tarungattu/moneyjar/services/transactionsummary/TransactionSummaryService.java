package com.tarungattu.moneyjar.services.transactionsummary;

import com.tarungattu.moneyjar.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionSummaryService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Map<String, Object> getTotalBalance(UUID userId) {
        BigDecimal total = transactionRepository.getTotalBalance(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("balance", total != null ? total : BigDecimal.ZERO);
        return result;
    }

    public List<Map<String, Object>> getTotalByType(UUID userId) {
        List<Object[]> rows = transactionRepository.getTotalByType(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("type", row[0]);
            map.put("total", row[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTotalByCategory(UUID userId) {
        List<Object[]> rows = transactionRepository.getTotalByCategory(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0] : "Uncategorized");
            map.put("total", row[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMonthlySummary(UUID userId) {
        List<Object[]> rows = transactionRepository.getMonthlySummary(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", ((String) row[0]).trim());
            map.put("totalIncome", row[1]);
            map.put("totalExpense", row[2]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getWeeklySummary(UUID userId) {
        List<Object[]> rows = transactionRepository.getWeeklySummary(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("week", row[0]);
            map.put("totalIncome", row[1]);
            map.put("totalExpense", row[2]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getExpensesByCategory(UUID userId) {
        List<Object[]> rows = transactionRepository.getExpensesByCategory(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0] : "Uncategorized");
            map.put("totalExpense", row[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getIncomesByCategory(UUID userId) {
        List<Object[]> rows = transactionRepository.getIncomesByCategory(userId);
        return rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0] : "Uncategorized");
            map.put("totalIncome", row[1]);
            return map;
        }).collect(Collectors.toList());
    }
}
