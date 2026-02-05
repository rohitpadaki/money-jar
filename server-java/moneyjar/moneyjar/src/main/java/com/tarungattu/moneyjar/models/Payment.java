package com.tarungattu.moneyjar.models;

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
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "\"groupId\"")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "\"fromUserId\"")
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "\"toUserId\"")
    private User toUser;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime date;

    @Column
    private String note;
}
