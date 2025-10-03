package com.tcc.alzheimer.dto.exams;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistoryCreateDTO {

    @NotNull
    private Long patientId;

    @NotBlank
    private String description;

}
