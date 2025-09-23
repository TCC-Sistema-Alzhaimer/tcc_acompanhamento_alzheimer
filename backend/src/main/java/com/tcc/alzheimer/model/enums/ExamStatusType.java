package com.tcc.alzheimer.model.enums;

public enum ExamStatusType {
    REQUESTED("Solicitado"),
    SCHEDULED("Agendado"),
    IN_PROGRESS("Em Andamento"),
    COMPLETED("Concluído"),
    CANCELLED("Cancelado"),
    PENDING_RESULT("Aguardando Resultado");

    private final String description;

    ExamStatusType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public String getId() {
        return this.name();
    }
}