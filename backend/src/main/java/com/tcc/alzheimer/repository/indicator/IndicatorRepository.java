package com.tcc.alzheimer.repository.indicator;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.indicator.Indicator;

public interface IndicatorRepository extends JpaRepository<Indicator, Long> {
    List<Indicator> findByPatientId(Long patientId);
}
