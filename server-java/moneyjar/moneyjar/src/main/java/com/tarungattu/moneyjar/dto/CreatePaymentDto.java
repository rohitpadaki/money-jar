package com.tarungattu.moneyjar.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreatePaymentDto {
    @NotNull
    private UUID toUserId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    private String note;
}
