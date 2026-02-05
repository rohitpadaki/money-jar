package com.tarungattu.moneyjar.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGroupDto {
    @NotBlank
    private String name;
}
