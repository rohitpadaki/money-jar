package com.tarungattu.moneyjar.dto;

import com.tarungattu.moneyjar.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTransactionDto {
    @NotNull
    private BigDecimal amount;

    @NotNull
    private TransactionType type;

    private String note;

    private UUID categoryId;
}
