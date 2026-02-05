package com.tarungattu.moneyjar.services.transaction;

import com.tarungattu.moneyjar.dto.CreateTransactionDto;
import com.tarungattu.moneyjar.dto.UpdateTransactionDto;
import com.tarungattu.moneyjar.models.Category;
import com.tarungattu.moneyjar.models.Transaction;
import com.tarungattu.moneyjar.models.User;
import com.tarungattu.moneyjar.repository.CategoryRepository;
import com.tarungattu.moneyjar.repository.TransactionRepository;
import com.tarungattu.moneyjar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Transaction> findAllByUser(UUID userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Transaction findOneByUser(UUID id, UUID userId) {
        return transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public Transaction create(UUID userId, CreateTransactionDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setNote(dto.getNote());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            transaction.setCategory(category);
        }

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(UUID id, UUID userId, UpdateTransactionDto dto) {
        Transaction transaction = findOneByUser(id, userId);

        if (dto.getAmount() != null) transaction.setAmount(dto.getAmount());
        if (dto.getType() != null) transaction.setType(dto.getType());
        if (dto.getNote() != null) transaction.setNote(dto.getNote());
        
        // Handle Category update (nullable or change)
        if (dto.getCategoryId() != null) {
             Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            transaction.setCategory(category);
        }

        return transactionRepository.save(transaction);
    }

    public void remove(UUID id, UUID userId) {
        Transaction transaction = findOneByUser(id, userId);
        transactionRepository.delete(transaction);
    }
}
