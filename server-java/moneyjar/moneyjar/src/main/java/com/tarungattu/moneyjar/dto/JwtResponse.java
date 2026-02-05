package com.tarungattu.moneyjar.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class JwtResponse { // matching NestJS response structure (accessToken)
    private String access_token;
    private UUID id;
    private String username;
    private String name;

    public JwtResponse(String accessToken, UUID id, String username, String name) {
        this.access_token = accessToken;
        this.id = id;
        this.username = username;
        this.name = name;
    }
}
