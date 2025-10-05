package com.tcc.alzheimer.controller.exams;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcc.alzheimer.model.exams.ExamType;
import com.tcc.alzheimer.repository.exams.ExamTypeRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/exams/types")
public class ExamTypeController {

    private final ExamTypeRepository examTypeRepository;

    public ExamTypeController(ExamTypeRepository examTypeRepository) {
        this.examTypeRepository = examTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ExamType>> getAllExamTypes() {
        List<ExamType> examTypes = examTypeRepository.findAll();
        return ResponseEntity.ok(examTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamType> getExamTypeById(@PathVariable String id) {
        Optional<ExamType> examType = examTypeRepository.findById(id);

        if (examType.isPresent()) {
            return ResponseEntity.ok(examType.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}