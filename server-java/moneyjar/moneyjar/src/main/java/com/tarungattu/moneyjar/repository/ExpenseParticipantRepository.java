package com.tarungattu.moneyjar.repository;

import com.tarungattu.moneyjar.models.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant, UUID> {
    
    // sum(ep.share) grouped by ep.userId where ep.expense.payerId = requestor
    @Query("SELECT ep.user.id, SUM(ep.share) FROM ExpenseParticipant ep WHERE ep.expense.group.id = :groupId AND ep.expense.payer.id = :payerId GROUP BY ep.user.id")
    java.util.List<Object[]> sumPaidByPayer(@Param("groupId") UUID groupId, @Param("payerId") UUID payerId);

    // sum(ep.share) where ep.userId = requestor group by e.payerId
    @Query("SELECT ep.expense.payer.id, SUM(ep.share) FROM ExpenseParticipant ep WHERE ep.expense.group.id = :groupId AND ep.user.id = :userId AND ep.expense.payer.id != :userId GROUP BY ep.expense.payer.id")
    java.util.List<Object[]> sumPaidForUser(@Param("groupId") UUID groupId, @Param("userId") UUID userId);
}
