package com.tcc.alzheimer.dto.files;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para informações básicas de arquivo na aplicação.
 * Links de download/visualização são gerados dinamicamente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileInfoDTO {
    private String id;
    private String name;
    private String mimeType;
    private Long size;
    private String formattedSize;
    private LocalDateTime createdTime;
    private LocalDateTime modifiedTime;
    private String downloadLink; // Gerado dinamicamente
    private String fileType;
    private Boolean isImage;
    private Boolean isPdf;
}