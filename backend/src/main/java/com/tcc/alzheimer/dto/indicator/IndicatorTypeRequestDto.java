package com.tcc.alzheimer.dto.indicator;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IndicatorTypeRequestDto {
    @NotBlank
    private String id;

    @NotBlank
    private String description;
}
