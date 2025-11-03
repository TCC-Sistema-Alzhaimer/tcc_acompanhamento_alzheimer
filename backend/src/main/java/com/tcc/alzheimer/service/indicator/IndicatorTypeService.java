package com.tcc.alzheimer.service.indicator;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.indicator.IndicatorTypeRequestDto;
import com.tcc.alzheimer.dto.indicator.IndicatorTypeResponseDto;
import com.tcc.alzheimer.model.exams.IndicatorType;
import com.tcc.alzheimer.repository.indicator.IndicatorTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IndicatorTypeService {

    private final IndicatorTypeRepository indicatorTypeRepository;

    @Transactional
    public IndicatorTypeResponseDto create(IndicatorTypeRequestDto dto) {
        if (indicatorTypeRepository.existsById(dto.getId())) {
            throw new RuntimeException("Já existe um tipo de indicador com esse ID");
        }

        IndicatorType type = new IndicatorType(dto.getId(), dto.getDescription());
        indicatorTypeRepository.save(type);
        return new IndicatorTypeResponseDto(type.getId(), type.getDescription());
    }

    public List<IndicatorTypeResponseDto> findAll() {
        return indicatorTypeRepository.findAll()
                .stream()
                .map(t -> new IndicatorTypeResponseDto(t.getId(), t.getDescription()))
                .collect(Collectors.toList());
    }

    public IndicatorTypeResponseDto findById(String id) {
        IndicatorType type = indicatorTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de indicador não encontrado"));
        return new IndicatorTypeResponseDto(type.getId(), type.getDescription());
    }

    @Transactional
    public IndicatorTypeResponseDto update(String id, IndicatorTypeRequestDto dto) {
        IndicatorType type = indicatorTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de indicador não encontrado"));
        type.setDescription(dto.getDescription());
        indicatorTypeRepository.save(type);
        return new IndicatorTypeResponseDto(type.getId(), type.getDescription());
    }

    @Transactional
    public void delete(String id) {
        IndicatorType type = indicatorTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de indicador não encontrado"));
        indicatorTypeRepository.delete(type);
    }
}
