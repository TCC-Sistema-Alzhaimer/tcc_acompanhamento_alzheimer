package com.tcc.alzheimer.seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.model.enums.ExamTypeEnum;
import com.tcc.alzheimer.model.exams.ExamType;
import com.tcc.alzheimer.repository.exams.ExamTypeRepository;

@Component
@Order(1)
public class ExamTypeSeed implements CommandLineRunner {

    private final ExamTypeRepository examTypeRepository;

    public ExamTypeSeed(ExamTypeRepository examTypeRepository) {
        this.examTypeRepository = examTypeRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("\n🧪 Iniciando criação de tipos de exames...\n");

        // Criar tipos usando o enum
        for (ExamTypeEnum examType : ExamTypeEnum.values()) {
            createExamType(examType.getId(), examType.getDescription());
        }

        printExamTypesSummary();
    }

    private void createExamType(String id, String description) {
        if (examTypeRepository.findById(id).isEmpty()) {
            ExamType examType = new ExamType();
            examType.setId(id);
            examType.setDescription(description);

            examTypeRepository.save(examType);
            System.out.println("Tipo de exame criado: " + id + " - " + description);
        } else {
            System.out.println("Tipo de exame já existe: " + id);
        }
    }

    private void printExamTypesSummary() {
        System.out.println("\nRESUMO DOS TIPOS DE EXAMES:");
        System.out.println("=====================================");
        System.out.println("COGNITIVE_TEST - Teste Cognitivo");
        System.out.println("MEMORY_TEST - Teste de Memória");
        System.out.println("NEUROLOGICAL_EXAM - Exame Neurológico");
        System.out.println("PSYCHIATRIC_EVAL - Avaliação Psiquiátrica");
        System.out.println("BLOOD_TEST - Exame de Sangue");
        System.out.println("BRAIN_SCAN - Tomografia/Ressonância");
        System.out.println("=====================================\n");
    }
}