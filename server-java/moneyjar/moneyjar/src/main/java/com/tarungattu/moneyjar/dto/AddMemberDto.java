package com.tarungattu.moneyjar.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddMemberDto {
    @NotNull
    private UUID userId;
}
