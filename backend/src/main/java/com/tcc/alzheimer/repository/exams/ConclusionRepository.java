package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.Conclusion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConclusionRepository extends JpaRepository<Conclusion, Long> {

    List<Conclusion> findByExamId(Long examId);

    List<Conclusion> findByDoctorId(Long doctorId);

    List<Conclusion> findByExamPatientIdOrderByCreatedAtDesc(Long patientId);

}
