package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    /**
     * Busca todos os registros de histórico médico de um paciente.
     *
     * @param patientId id do paciente
     * @return lista de MedicalHistory
     */
    List<MedicalHistory> findByPatientId(Long patientId);

    /**
     * Busca apenas históricos ativos de um paciente.
     */
    List<MedicalHistory> findByPatientIdAndIsActiveTrue(Long patientId);

}
