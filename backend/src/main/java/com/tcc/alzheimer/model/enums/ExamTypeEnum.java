package com.tcc.alzheimer.model.enums;

public enum ExamTypeEnum {
    COGNITIVE_TEST("Teste Cognitivo"),
    MEMORY_TEST("Teste de Memória"),
    NEUROLOGICAL_EXAM("Exame Neurológico"),
    PSYCHIATRIC_EVAL("Avaliação Psiquiátrica"),
    BLOOD_TEST("Exame de Sangue"),
    BRAIN_SCAN("Tomografia/Ressonância do Cérebro");

    private final String description;

    ExamTypeEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public String getId() {
        return this.name();
    }
}