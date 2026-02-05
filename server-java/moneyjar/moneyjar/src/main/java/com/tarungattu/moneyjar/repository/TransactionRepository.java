package com.tarungattu.moneyjar.repository;

import com.tarungattu.moneyjar.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    java.util.List<Transaction> findByUserIdOrderByDateDesc(UUID userId);
    java.util.Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);

    @Query(value = "SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) FROM transaction WHERE \"userId\" = :userId", nativeQuery = true)
    java.math.BigDecimal getTotalBalance(@Param("userId") UUID userId);

    @Query(value = "SELECT type, SUM(amount) FROM transaction WHERE \"userId\" = :userId GROUP BY type", nativeQuery = true)
    java.util.List<Object[]> getTotalByType(@Param("userId") UUID userId);

    // Join with category. Category table name is 'category'. Join column in transaction is 'categoryId'.
    @Query(value = "SELECT c.name, SUM(t.amount) FROM transaction t LEFT JOIN category c ON t.\"categoryId\" = c.id WHERE t.\"userId\" = :userId GROUP BY c.name", nativeQuery = true)
    java.util.List<Object[]> getTotalByCategory(@Param("userId") UUID userId);

    @Query(value = "SELECT TO_CHAR(DATE_TRUNC('month', t.date), 'FMMonth YYYY') as month, " +
            "SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income, " +
            "SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense " +
            "FROM transaction t WHERE t.\"userId\" = :userId " +
            "GROUP BY DATE_TRUNC('month', t.date) " +
            "ORDER BY DATE_TRUNC('month', t.date) ASC", nativeQuery = true)
    java.util.List<Object[]> getMonthlySummary(@Param("userId") UUID userId);

    @Query(value = "SELECT TO_CHAR(DATE_TRUNC('week', t.date), 'IYYY-IW') as week, " +
            "SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income, " +
            "SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense " +
            "FROM transaction t WHERE t.\"userId\" = :userId " +
            "GROUP BY DATE_TRUNC('week', t.date) " +
            "ORDER BY DATE_TRUNC('week', t.date) ASC", nativeQuery = true)
    java.util.List<Object[]> getWeeklySummary(@Param("userId") UUID userId);

    @Query(value = "SELECT c.name, SUM(t.amount) FROM transaction t LEFT JOIN category c ON t.\"categoryId\" = c.id WHERE t.\"userId\" = :userId AND t.type = 'expense' GROUP BY c.name ORDER BY SUM(t.amount) DESC", nativeQuery = true)
    java.util.List<Object[]> getExpensesByCategory(@Param("userId") UUID userId);
    
    @Query(value = "SELECT c.name, SUM(t.amount) FROM transaction t LEFT JOIN category c ON t.\"categoryId\" = c.id WHERE t.\"userId\" = :userId AND t.type = 'income' GROUP BY c.name ORDER BY SUM(t.amount) DESC", nativeQuery = true)
    java.util.List<Object[]> getIncomesByCategory(@Param("userId") UUID userId);
}
