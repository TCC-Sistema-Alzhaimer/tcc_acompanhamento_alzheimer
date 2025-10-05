package com.tcc.alzheimer.dto.exams;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para informações dos resultados de exame
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResultDTO {

    private Long id;
    private Long fileId;
    private String fileName;
    private String fileType;
    private String mimeType;
    private Long fileSize;
    private String formattedFileSize;
    private String downloadLink;
    private Boolean isImage;
    private Boolean isPdf;
    private LocalDateTime uploadDate;
    private Boolean isActive;
}