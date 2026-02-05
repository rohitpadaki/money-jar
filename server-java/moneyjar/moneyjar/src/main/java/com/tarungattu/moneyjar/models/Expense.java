package com.tarungattu.moneyjar.models;

import com.tarungattu.moneyjar.enums.SplitType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "expense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "\"groupId\"")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"members", "createdBy"})
    private Group group;

    @ManyToOne
    @JoinColumn(name = "\"payerId\"")
    private User payer;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"splitType\"", nullable = false)
    private SplitType splitType = SplitType.ALL;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", updatable = false, nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ExpenseParticipant> participants;
}
