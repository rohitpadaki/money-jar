package com.tarungattu.moneyjar.models;

import com.tarungattu.moneyjar.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @Column
    private String note;

    @CreationTimestamp
    @Column(columnDefinition = "timestamp", updatable = false, nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "\"userId\"")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "roles"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "\"categoryId\"")
    private Category category;
}
