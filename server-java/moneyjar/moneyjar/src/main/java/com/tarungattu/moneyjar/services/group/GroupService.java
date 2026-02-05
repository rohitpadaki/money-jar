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

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Group createGroup(UUID userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = new Group();
        group.setName(name);
        group.setCreatedBy(user);
        
        Group savedGroup = groupRepository.save(group);

        GroupMember member = new GroupMember();
        member.setGroup(savedGroup);
        member.setUser(user);
        
        groupMemberRepository.save(member);

        return savedGroup;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserGroups(UUID userId) {
        List<GroupMember> memberships = groupMemberRepository.findByUserId(userId);
        
        return memberships.stream().map(m -> {
            Group group = m.getGroup();
            Map<String, Object> map = new HashMap<>();
            map.put("id", group.getId());
            map.put("name", group.getName());
            
            // Handle potentially missing creator (though schematic says nullable=false usually)
            if (group.getCreatedBy() != null) {
                Map<String, Object> creator = new HashMap<>();
                creator.put("id", group.getCreatedBy().getId());
                creator.put("username", group.getCreatedBy().getUsername());
                map.put("createdBy", creator);
            }
            
            map.put("memberCount", group.getMembers() != null ? group.getMembers().size() : 0);
            
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getGroupDetails(UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", group.getId());
        response.put("name", group.getName());
        
        if (group.getCreatedBy() != null) {
            Map<String, Object> creator = new HashMap<>();
            creator.put("id", group.getCreatedBy().getId());
            creator.put("username", group.getCreatedBy().getUsername());
            response.put("createdBy", creator);
        }
        
        if (group.getMembers() != null) {
            List<Map<String, Object>> members = group.getMembers().stream().map(m -> {
                Map<String, Object> memberMap = new HashMap<>();
                memberMap.put("id", m.getUser().getId());
                memberMap.put("username", m.getUser().getUsername());
                memberMap.put("joinedAt", m.getJoinedAt());
                return memberMap;
            }).collect(Collectors.toList());
            response.put("members", members);
        } else {
             response.put("members", Collections.emptyList());
        }
        
        response.put("createdAt", group.getCreatedAt());
        
        return response;
    }

    @Transactional
    public void deleteGroup(UUID groupId, UUID userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only the group creator can delete the group");
        }

        groupRepository.delete(group);
    }
}
