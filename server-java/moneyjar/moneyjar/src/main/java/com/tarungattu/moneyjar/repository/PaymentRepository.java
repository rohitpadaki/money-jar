package com.tarungattu.moneyjar.repository;

import com.tarungattu.moneyjar.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    java.util.List<Payment> findByGroupIdOrderByDateDesc(UUID groupId);

    @Query("SELECT p.fromUser.id, p.toUser.id, SUM(p.amount) FROM Payment p WHERE p.group.id = :groupId AND (p.fromUser.id = :userId OR p.toUser.id = :userId) GROUP BY p.fromUser.id, p.toUser.id")
    java.util.List<Object[]> sumPaymentsInvolvingUser(@Param("groupId") UUID groupId, @Param("userId") UUID userId);
}
