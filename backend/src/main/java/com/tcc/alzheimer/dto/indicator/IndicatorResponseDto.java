package com.tcc.alzheimer.dto.indicator;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndicatorResponseDto {

    private Long id;
    private Double valor;
    private String descricao;
    private LocalDate data;

    private String tipoDescricao;
    private String tipoId;

    private Long patientId;
    private String patientName;

    private Long fileId;
    private Long conclusionId;
}
