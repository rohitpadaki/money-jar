package com.tarungattu.moneyjar.services.group;

import com.tarungattu.moneyjar.models.Group;
import com.tarungattu.moneyjar.models.GroupMember;
import com.tarungattu.moneyjar.models.User;
import com.tarungattu.moneyjar.repository.GroupMemberRepository;
import com.tarungattu.moneyjar.repository.GroupRepository;
import com.tarungattu.moneyjar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GroupMemberService {

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public GroupMember addMember(UUID groupId, UUID userId, UUID requesterId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().getId().equals(requesterId)) {
            throw new RuntimeException("Only the group creator can add members");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already a member
        boolean isMember = group.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(userId));
        if (isMember) {
            throw new RuntimeException("User is already a member of this group");
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);

        return groupMemberRepository.save(member);
    }

    @Transactional
    public void removeMember(UUID groupId, UUID userId, UUID requesterId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().getId().equals(requesterId)) {
            throw new RuntimeException("Only the group creator can remove members");
        }

        if (group.getCreatedBy().getId().equals(userId)) {
             throw new RuntimeException("Cannot remove the group creator");
        }

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        groupMemberRepository.delete(member);
    }

    @Transactional
    public void leaveGroup(UUID groupId, UUID userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (group.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Group creator cannot leave the group");
        }

        GroupMember member = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        groupMemberRepository.delete(member);
    }
}
