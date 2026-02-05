package com.tarungattu.moneyjar.dto;

import com.tarungattu.moneyjar.enums.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UpdateTransactionDto {
    private BigDecimal amount;
    private TransactionType type;
    private String note;
    private UUID categoryId;
}
