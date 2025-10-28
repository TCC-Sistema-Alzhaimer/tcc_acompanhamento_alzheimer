package com.tcc.alzheimer.dto.exams;

import java.time.LocalDateTime;
import java.util.List;

import com.tcc.alzheimer.dto.files.FileInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConclusionResponseDTO {

    private Long id;
    private Long examId;
    private Long doctorId;
    private String description;
    private String notes;
    private String conclusion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long updatedBy;
    private List<FileInfoDTO> files;

}
