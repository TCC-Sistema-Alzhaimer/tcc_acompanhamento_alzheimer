package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByPatientId(Long patientId);

    List<Exam> findByDoctorId(Long doctorId);

    List<Exam> findByStatusId(String statusId);

    List<Exam> findByTypeId(String typeId);
}