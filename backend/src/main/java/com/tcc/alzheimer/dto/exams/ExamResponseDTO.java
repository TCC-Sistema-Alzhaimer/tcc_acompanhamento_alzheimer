package com.tcc.alzheimer.dto.exams;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponseDTO {

    private Long id;
    private Long doctorId;
    private Long patientId;
    private String examTypeId;
    private String examStatusId;
    private LocalDateTime requestDate;
    private String instructions;
    private String result;
    private String note;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}