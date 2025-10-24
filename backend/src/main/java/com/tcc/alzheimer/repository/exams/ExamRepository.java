package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    Optional<Exam> findByIdAndActiveTrue(Long id);

    List<Exam> findByPatientId(Long patientId);

    List<Exam> findAllByActiveTrue();

    List<Exam> findByPatientIdAndActiveTrue(Long patientId);

    List<Exam> findByDoctorIdAndActiveTrue(Long doctorId);

    List<Exam> findByStatusIdAndActiveTrue(String statusId);

    List<Exam> findByTypeIdAndActiveTrue(String typeId);
}
