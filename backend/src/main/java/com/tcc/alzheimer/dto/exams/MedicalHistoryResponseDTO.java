package com.tcc.alzheimer.dto.exams;

import com.tcc.alzheimer.dto.files.FileInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistoryResponseDTO {
    private Long id;
    private Long patientId;
    private String description;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
    private List<FileInfoDTO> files;
}
