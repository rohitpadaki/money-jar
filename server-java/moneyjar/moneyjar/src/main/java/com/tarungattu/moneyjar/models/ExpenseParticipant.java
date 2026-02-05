package com.tarungattu.moneyjar.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "expense_participant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "\"expenseId\"")
    private Expense expense;

    @ManyToOne(optional = false)
    @JoinColumn(name = "\"userId\"")
    private User user;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal share;
}
