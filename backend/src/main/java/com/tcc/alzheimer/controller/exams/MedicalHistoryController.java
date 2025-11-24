package com.tcc.alzheimer.controller.exams;

import com.tcc.alzheimer.dto.exams.MedicalHistoryCreateDTO;
import com.tcc.alzheimer.dto.exams.MedicalHistoryResponseDTO;
import com.tcc.alzheimer.service.exams.MedicalHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/medical-history")
public class MedicalHistoryController {

    private final MedicalHistoryService medicalHistoryService;

    public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<MedicalHistoryResponseDTO> createMedicalHistory(
            @RequestPart("data") @Validated MedicalHistoryCreateDTO dto,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        MedicalHistoryResponseDTO response = medicalHistoryService.createMedicalHistory(dto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<MedicalHistoryResponseDTO> getById(@PathVariable("id") Long id) {
        MedicalHistoryResponseDTO response = medicalHistoryService.getMedicalHistoryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/patient/{patientId}")
    public ResponseEntity<java.util.List<MedicalHistoryResponseDTO>> getByPatient(
            @PathVariable("patientId") Long patientId) {
        java.util.List<MedicalHistoryResponseDTO> list = medicalHistoryService
                .getMedicalHistoriesByPatientId(patientId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteMedicalHistory(@PathVariable("id") Long id) {
        medicalHistoryService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

}
