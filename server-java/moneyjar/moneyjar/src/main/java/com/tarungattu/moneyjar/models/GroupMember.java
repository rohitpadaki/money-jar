package com.tarungattu.moneyjar.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "group_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "\"groupId\"")
    private Group group;

    @ManyToOne(optional = false)
    @JoinColumn(name = "\"userId\"")
    private User user;

    @CreationTimestamp
    @Column(name = "\"joinedAt\"", updatable = false, nullable = false)
    private LocalDateTime joinedAt;
}
