package com.tcc.alzheimer;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tcc.alzheimer.model.Exam;
import com.tcc.alzheimer.repository.ExamRepository;

@Component
public class ExamTestRunner implements CommandLineRunner {

    private final ExamRepository examRepository;

    public ExamTestRunner(ExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @Override
    public void run(String... args) {
        Exam exam = Exam.builder()
                .doctorId(1)
                .patientId(2)
                .type("Blood Test")
                .requestDate(LocalDate.now())
                .result("Pending")
                .note("Paciente deve estar em jejum")
                .status("REQUESTED")
                .build();

        examRepository.save(exam);

        System.out.println("✅ Exame salvo com ID:  " + exam.getId());
    }
}
