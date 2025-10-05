package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamStatusRepository extends JpaRepository<ExamStatus, String> {
}