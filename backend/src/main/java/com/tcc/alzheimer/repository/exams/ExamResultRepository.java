package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.ExamResult;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {

}