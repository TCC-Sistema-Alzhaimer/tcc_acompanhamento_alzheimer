package com.tcc.alzheimer.repository.exams;

import com.tcc.alzheimer.model.exams.ExamResult;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {

    /**
     * Busca todos os resultados de um exame específico
     * 
     * @param examId ID do exame
     * @return Lista de resultados do exame
     */
    List<ExamResult> findByExamIdAndIsActiveTrue(Long examId);

    /**
     * Busca todos os resultados de um exame (incluindo inativos)
     * 
     * @param examId ID do exame
     * @return Lista de todos os resultados do exame
     */
    List<ExamResult> findByExamId(Long examId);
}