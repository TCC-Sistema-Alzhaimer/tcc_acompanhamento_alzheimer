package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.ExamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamTypeRepository extends JpaRepository<ExamType, String> {
}