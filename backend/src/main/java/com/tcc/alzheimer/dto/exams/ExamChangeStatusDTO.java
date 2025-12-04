package com.tcc.alzheimer.dto.exams;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamChangeStatusDTO {
    @NotNull(message = "Exam ID is required")
    private String status;
}
