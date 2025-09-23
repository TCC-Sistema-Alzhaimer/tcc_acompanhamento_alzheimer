package com.tcc.alzheimer.seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.model.enums.ExamStatusType;
import com.tcc.alzheimer.model.exams.ExamStatus;
import com.tcc.alzheimer.repository.exams.ExamStatusRepository;

@Component
@Order(2)
public class ExamStatusSeed implements CommandLineRunner {

    private final ExamStatusRepository examStatusRepository;

    public ExamStatusSeed(ExamStatusRepository examStatusRepository) {
        this.examStatusRepository = examStatusRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("\n Iniciando criação de status de exames...\n");

        // Criar status usando o enum
        for (ExamStatusType statusType : ExamStatusType.values()) {
            createExamStatus(statusType.getId(), statusType.getDescription());
        }

        printExamStatusSummary();
    }

    private void createExamStatus(String id, String description) {
        if (examStatusRepository.findById(id).isEmpty()) {
            ExamStatus examStatus = new ExamStatus();
            examStatus.setId(id);
            examStatus.setDescription(description);

            examStatusRepository.save(examStatus);
            System.out.println("Status de exame criado: " + id + " - " + description);
        } else {
            System.out.println("Status de exame já existe: " + id);
        }
    }

    private void printExamStatusSummary() {
        System.out.println("\nRESUMO DOS STATUS DE EXAMES:");
        System.out.println("=====================================");
        System.out.println("REQUESTED - Solicitado");
        System.out.println("SCHEDULED - Agendado");
        System.out.println("IN_PROGRESS - Em Andamento");
        System.out.println("COMPLETED - Concluído");
        System.out.println("CANCELLED - Cancelado");
        System.out.println("PENDING_RESULT - Aguardando Resultado");
        System.out.println("=====================================\n");
    }
}