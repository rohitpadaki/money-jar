package com.tarungattu.moneyjar.dto;

import com.tarungattu.moneyjar.enums.SplitType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateExpenseDto {
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    private String note;

    @NotNull
    private SplitType splitType = SplitType.ALL;

    private List<UUID> participants; // Used only if splitType is SELECTED
}
