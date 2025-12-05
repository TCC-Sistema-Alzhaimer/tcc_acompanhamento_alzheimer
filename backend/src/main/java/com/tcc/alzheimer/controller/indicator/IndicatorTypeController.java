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

import com.tcc.alzheimer.dto.indicator.IndicatorTypeRequestDto;
import com.tcc.alzheimer.dto.indicator.IndicatorTypeResponseDto;
import com.tcc.alzheimer.service.indicator.IndicatorTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/indicator-type")
@RequiredArgsConstructor
public class IndicatorTypeController {

    private final IndicatorTypeService indicatorTypeService;

    @PostMapping
    public ResponseEntity<IndicatorTypeResponseDto> create(@Valid @RequestBody IndicatorTypeRequestDto dto) {
        return ResponseEntity.ok(indicatorTypeService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<IndicatorTypeResponseDto>> findAll() {
        return ResponseEntity.ok(indicatorTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndicatorTypeResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(indicatorTypeService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IndicatorTypeResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody IndicatorTypeRequestDto dto
    ) {
        return ResponseEntity.ok(indicatorTypeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        indicatorTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
