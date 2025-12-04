package com.tcc.alzheimer.dto.indicator;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IndicatorRequestDto {

    @NotNull
    private Double valor;

    @NotNull
    private String descricao;

    @NotNull
    private LocalDateTime data;

    @NotNull
    private String tipoId; // referência ao IndicatorType

    @NotNull
    private Long patientId;

    private Long fileId;       // opcional
    private Long conclusionId; // opcional
}
