package com.tcc.alzheimer.controller.exams;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcc.alzheimer.model.exams.ExamStatus;
import com.tcc.alzheimer.repository.exams.ExamStatusRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/exams/status")
public class ExamStatusController {

    private final ExamStatusRepository examStatusRepository;

    public ExamStatusController(ExamStatusRepository examStatusRepository) {
        this.examStatusRepository = examStatusRepository;
    }

    @GetMapping
    public ResponseEntity<List<ExamStatus>> getAllExamStatus() {
        List<ExamStatus> examStatuses = examStatusRepository.findAll();
        return ResponseEntity.ok(examStatuses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamStatus> getExamStatusById(@PathVariable String id) {
        Optional<ExamStatus> examStatus = examStatusRepository.findById(id);

        if (examStatus.isPresent()) {
            return ResponseEntity.ok(examStatus.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}