package com.tcc.alzheimer.dto.exams;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConclusionCreateDTO {

    @NotNull
    private Long examId;

    @NotNull
    private Long doctorId;

    @NotBlank
    private String description;

    private String notes;

    @NotBlank
    private String conclusion;

}
