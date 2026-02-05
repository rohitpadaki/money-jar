package com.tarungattu.moneyjar.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String name;
    private String password;
}
