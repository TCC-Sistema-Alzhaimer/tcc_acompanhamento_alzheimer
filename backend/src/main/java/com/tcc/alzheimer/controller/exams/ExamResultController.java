package com.tcc.alzheimer.controller.exams;

import com.tcc.alzheimer.service.exams.ExamResultService;

import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/exams/{examId}/results")
public class ExamResultController {

    private final ExamResultService examResultService;

    public ExamResultController(ExamResultService examResultService) {
        this.examResultService = examResultService;
    }

    /**
     * Faz upload do resultado do exame.
     * Acessível por PATIENT e CAREGIVER.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('PATIENT') or hasRole('CAREGIVER')")
    public ResponseEntity<?> uploadExamResult(
            @PathVariable Long examId,
            @RequestParam("file") @NotNull MultipartFile file) {

        return ResponseEntity.ok(examResultService.uploadExamResult(examId, file));
    }
}