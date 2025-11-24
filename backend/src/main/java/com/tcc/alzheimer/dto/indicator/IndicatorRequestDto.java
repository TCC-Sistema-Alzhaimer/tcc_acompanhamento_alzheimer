package com.tcc.alzheimer.dto.indicator;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IndicatorRequestDto {

    @NotNull
    private Double valor;

    @NotNull
    private String descricao;

    @NotNull
    private LocalDate data;

    @NotNull
    private String tipoId; // referência ao IndicatorType

    @NotNull
    private Long patientId;

    private Long fileId;       // opcional
    private Long conclusionId; // opcional
}
