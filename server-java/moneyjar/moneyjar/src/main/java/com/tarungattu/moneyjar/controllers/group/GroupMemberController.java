package com.tarungattu.moneyjar.controllers.group;

import com.tarungattu.moneyjar.dto.AddMemberDto;
import com.tarungattu.moneyjar.security.UserDetailsImpl;
import com.tarungattu.moneyjar.services.group.GroupMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/group-members")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroupMemberController {

    @Autowired
    private GroupMemberService groupMemberService;

    @PostMapping("/{groupId}/add")
    public ResponseEntity<?> addMember(@PathVariable UUID groupId, @RequestBody AddMemberDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(groupMemberService.addMember(groupId, dto.getUserId(), userDetails.getId()));
    }

    @DeleteMapping("/{groupId}/remove/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable UUID groupId, @PathVariable UUID userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        groupMemberService.removeMember(groupId, userId, userDetails.getId());
        return ResponseEntity.ok().body("{\"message\": \"Member removed\"}");
    }

    @DeleteMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(@PathVariable UUID groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        groupMemberService.leaveGroup(groupId, userDetails.getId());
        return ResponseEntity.ok().body("{\"message\": \"You have left the group\"}");
    }
}
