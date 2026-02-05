package com.tarungattu.moneyjar.repository;

import com.tarungattu.moneyjar.models.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    java.util.List<GroupMember> findByUserId(UUID userId);
    java.util.Optional<GroupMember> findByGroupIdAndUserId(UUID groupId, UUID userId);
}
