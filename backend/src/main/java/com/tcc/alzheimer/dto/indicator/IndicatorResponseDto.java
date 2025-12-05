package com.tcc.alzheimer.dto.indicator;

import java.time.LocalDateTime;

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
    private LocalDateTime data;

    private String tipoDescricao;
    private Long tipoId;

    private Long patientId;
    private String patientName;

    private Long fileId;
    private Long conclusionId;
}
