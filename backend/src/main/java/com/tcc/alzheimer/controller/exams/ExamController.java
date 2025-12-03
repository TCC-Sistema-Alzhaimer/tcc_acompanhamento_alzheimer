package com.tcc.alzheimer.controller.exams;

import com.tcc.alzheimer.dto.exams.ExamChangeStatusDTO;
import com.tcc.alzheimer.dto.exams.ExamCreateDTO;
import com.tcc.alzheimer.dto.exams.ExamResponseDTO;
import com.tcc.alzheimer.exception.InsufficientRoleException;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.service.exams.ExamService;
import com.tcc.alzheimer.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/exams")
public class ExamController {

    private final ExamService examService;
    private final AuthService authService;

    public ExamController(ExamService examService, AuthService authService) {
        this.examService = examService;
        this.authService = authService;
    }

    /**
     * Cria um novo exame.
     * 
     * RESTRIÇÃO: Apenas usuários com role DOCTOR podem criar exames.
     * 
     * @param examCreateDTO Dados do exame a ser criado
     * @return Dados do exame criado
     * @throws org.springframework.security.access.AccessDeniedException se o
     *                                                                   usuário não
     *                                                                   for DOCTOR
     */
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ExamResponseDTO> createExam(@Valid @RequestBody ExamCreateDTO examCreateDTO) {
        // Dupla validação: anotação @PreAuthorize + validação manual
        // (a anotação já bloqueia, mas mantemos a validação manual como backup)
        if (!authService.hasRole(UserType.DOCTOR.name())) {
            throw InsufficientRoleException.forOperation("criar exame", UserType.DOCTOR.name());
        }

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

    @PutMapping("/{id}/status")
    public ResponseEntity<ExamResponseDTO> changeExamStatus(@PathVariable String id, @RequestBody ExamChangeStatusDTO entity) {
        ExamResponseDTO result= examService.changeExamStatus(id, entity.getStatus());  
        return ResponseEntity.ok(result);
    }
}