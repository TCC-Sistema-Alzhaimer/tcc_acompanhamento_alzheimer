package com.tcc.alzheimer.controller.exams;

import com.tcc.alzheimer.dto.exams.ExamCreateDTO;
import com.tcc.alzheimer.dto.exams.ExamResponseDTO;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.service.exams.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
public class ExamController {
    
    private final ExamService examService;
    
    public ExamController(ExamService examService) {
        this.examService = examService;
    }
    
    @PostMapping
    public ResponseEntity<ExamResponseDTO> createExam(@Valid @RequestBody ExamCreateDTO examCreateDTO) {
        Exam createdExam = examService.createExam(examCreateDTO);
        ExamResponseDTO responseDTO = examService.toResponseDTO(createdExam);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<ExamResponseDTO>> getAllExams() {
        List<Exam> exams = examService.findAll();
        List<ExamResponseDTO> responseDTOs = exams.stream()
                .map(examService::toResponseDTO)
                .toList();
        return ResponseEntity.ok(responseDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExamResponseDTO> getExamById(@PathVariable Long id) {
        Exam exam = examService.findById(id);
        ExamResponseDTO responseDTO = examService.toResponseDTO(exam);
        return ResponseEntity.ok(responseDTO);
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ExamResponseDTO>> getExamsByPatientId(@PathVariable Long patientId) {
        List<Exam> exams = examService.findByPatientId(patientId);
        List<ExamResponseDTO> responseDTOs = exams.stream()
                .map(examService::toResponseDTO)
                .toList();
        return ResponseEntity.ok(responseDTOs);
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<ExamResponseDTO>> getExamsByDoctorId(@PathVariable Long doctorId) {
        List<Exam> exams = examService.findByDoctorId(doctorId);
        List<ExamResponseDTO> responseDTOs = exams.stream()
                .map(examService::toResponseDTO)
                .toList();
        return ResponseEntity.ok(responseDTOs);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}