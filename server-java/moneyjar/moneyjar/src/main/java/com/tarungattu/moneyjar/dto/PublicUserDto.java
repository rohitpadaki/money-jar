package com.tarungattu.moneyjar.dto;

import com.tarungattu.moneyjar.models.User;
import lombok.Data;
import java.util.UUID;

@Data
public class PublicUserDto {
    private UUID id;
    private String username;
    private String name;

    public PublicUserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
    }
}
