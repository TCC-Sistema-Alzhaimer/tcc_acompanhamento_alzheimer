package com.tcc.alzheimer.service.indicator;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.indicator.IndicatorRequestDto;
import com.tcc.alzheimer.dto.indicator.IndicatorResponseDto;
import com.tcc.alzheimer.model.exams.Conclusion;
import com.tcc.alzheimer.model.exams.IndicatorType;
import com.tcc.alzheimer.model.files.File;
import com.tcc.alzheimer.model.indicator.Indicator;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.exams.ConclusionRepository;
import com.tcc.alzheimer.repository.files.FileRepository;
import com.tcc.alzheimer.repository.indicator.IndicatorRepository;
import com.tcc.alzheimer.repository.indicator.IndicatorTypeRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IndicatorService {

    private final IndicatorRepository indicatorRepository;
    private final IndicatorTypeRepository indicatorTypeRepository;
    private final PatientRepository patientRepository;
    private final FileRepository fileRepository;
    private final ConclusionRepository conclusionRepository;

    @Transactional
    public IndicatorResponseDto create(IndicatorRequestDto dto) {
        IndicatorType tipo = indicatorTypeRepository.findById(dto.getTipoId())
                .orElseThrow(() -> new RuntimeException("Tipo de indicador não encontrado"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        File file = null;
        if (dto.getFileId() != null) {
            file = fileRepository.findById(dto.getFileId())
                    .orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));
        }

        Conclusion conclusion = null;
        if (dto.getConclusionId() != null) {
            conclusion = conclusionRepository.findById(dto.getConclusionId())
                    .orElseThrow(() -> new RuntimeException("Conclusão não encontrada"));
        }

        Indicator indicator = new Indicator();
        indicator.setValor(dto.getValor());
        indicator.setDescricao(dto.getDescricao());
        indicator.setData(dto.getData());
        indicator.setTipo(tipo);
        indicator.setPatient(patient);
        indicator.setFile(file);
        indicator.setConclusion(conclusion);

        indicatorRepository.save(indicator);
        return toResponse(indicator);
    }

    @Transactional(readOnly = true)
    public IndicatorResponseDto findById(Long id) {
        Indicator indicator = indicatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Indicador não encontrado"));
        return toResponse(indicator);
    }

    @Transactional(readOnly = true)
    public List<IndicatorResponseDto> findByPatientId(Long patientId) {
        return indicatorRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private IndicatorResponseDto toResponse(Indicator indicator) {
        return new IndicatorResponseDto(
                indicator.getId(),
                indicator.getValor(),
                indicator.getDescricao(),
                indicator.getData(),
                indicator.getTipo().getDescription(),
                indicator.getTipo().getId(),
                indicator.getPatient().getId(),
                indicator.getPatient().getName(),
                indicator.getFile() != null ? indicator.getFile().getId() : null,
                indicator.getConclusion() != null ? indicator.getConclusion().getId() : null);
    }

    @Transactional
    public IndicatorResponseDto update(Long id, IndicatorRequestDto dto) {
        Indicator indicator = indicatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Indicador não encontrado"));

        IndicatorType tipo = indicatorTypeRepository.findById(dto.getTipoId())
                .orElseThrow(() -> new RuntimeException("Tipo de indicador não encontrado"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        File file = null;
        if (dto.getFileId() != null)
            file = fileRepository.findById(dto.getFileId())
                    .orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));

        Conclusion conclusion = null;
        if (dto.getConclusionId() != null)
            conclusion = conclusionRepository.findById(dto.getConclusionId())
                    .orElseThrow(() -> new RuntimeException("Conclusão não encontrada"));

        indicator.setValor(dto.getValor());
        indicator.setDescricao(dto.getDescricao());
        indicator.setData(dto.getData());
        indicator.setTipo(tipo);
        indicator.setPatient(patient);
        indicator.setFile(file);
        indicator.setConclusion(conclusion);

        indicatorRepository.save(indicator);
        return toResponse(indicator);
    }

    @Transactional
    public void delete(Long id) {
        Indicator indicator = indicatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Indicador não encontrado"));
        indicatorRepository.delete(indicator);
    }

    @Transactional(readOnly = true)
    public List<IndicatorResponseDto> findAll() {
        return indicatorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}