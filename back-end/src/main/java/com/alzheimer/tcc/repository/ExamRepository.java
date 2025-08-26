package com.alzheimer.tcc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alzheimer.tcc.model.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {
}