package com.tcc.alzheimer.dto.exams;

import com.tcc.alzheimer.dto.files.FileInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para resposta do upload de resultado de exame
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResultUploadResponseDTO {

    private Long examResultId;
    private Long examId;
    private String examType;
    private Long patientId;
    private String patientName;
    private FileInfoDTO file;
    private String message;
    private LocalDateTime uploadDate;
}