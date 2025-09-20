package com.tcc.alzheimer.dto.files;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de upload de arquivo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponseDTO {
    private String fileId;
    private String fileName;
    private String message;
    private String webViewLink;
    private String webContentLink;
    private Long size;
}