package com.tcc.alzheimer.controller.exams;

import com.tcc.alzheimer.dto.exams.ConclusionCreateDTO;
import com.tcc.alzheimer.dto.exams.ConclusionResponseDTO;
import com.tcc.alzheimer.service.exams.ConclusionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/conclusions")
public class ConclusionController {

    private final ConclusionService conclusionService;

    public ConclusionController(ConclusionService conclusionService) {
        this.conclusionService = conclusionService;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ConclusionResponseDTO> create(
            @RequestPart("data") @Validated ConclusionCreateDTO dto,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        ConclusionResponseDTO created = conclusionService.createConclusion(dto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ConclusionResponseDTO> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(conclusionService.getById(id));
    }

    @GetMapping(path = "/exam/{examId}")
    public ResponseEntity<List<ConclusionResponseDTO>> getByExam(@PathVariable("examId") Long examId) {
        return ResponseEntity.ok(conclusionService.getByExamId(examId));
    }

    @GetMapping(path = "/patient/{patientId}")
    public ResponseEntity<List<ConclusionResponseDTO>> getByPatient(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(conclusionService.getByPatientId(patientId));
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<ConclusionResponseDTO> update(@PathVariable("id") Long id,
            @Validated @RequestBody ConclusionCreateDTO dto) {
        return ResponseEntity.ok(conclusionService.updateConclusion(id, dto));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        conclusionService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
