package com.tcc.alzheimer.controller.indicator;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.indicator.IndicatorRequestDto;
import com.tcc.alzheimer.dto.indicator.IndicatorResponseDto;
import com.tcc.alzheimer.service.indicator.IndicatorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/indicator")
@RequiredArgsConstructor
public class IndicatorController {

    private final IndicatorService indicatorService;

    @PostMapping
    public ResponseEntity<IndicatorResponseDto> create(@Valid @RequestBody IndicatorRequestDto dto) {
        return ResponseEntity.ok(indicatorService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndicatorResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(indicatorService.findById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<IndicatorResponseDto>> findByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(indicatorService.findByPatientId(patientId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IndicatorResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody IndicatorRequestDto dto) {
        return ResponseEntity.ok(indicatorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        indicatorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
