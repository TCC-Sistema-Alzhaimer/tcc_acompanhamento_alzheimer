package com.tcc.alzheimer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {
}