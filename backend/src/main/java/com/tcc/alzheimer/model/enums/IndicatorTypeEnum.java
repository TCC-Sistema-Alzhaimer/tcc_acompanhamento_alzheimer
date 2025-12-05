package com.tcc.alzheimer.model.enums;

public enum IndicatorTypeEnum {
    
    ATIVIDADE_FISICA(1L, "Nível de Atividade Física"),
    QUALIDADE_SONO(2L, "Qualidade do Sono"),
    AGITACAO(3L, "Nível de Agitação"),
    COGNICAO(4L, "Cognição / Estado Mental");

    private final Long id;
    private final String description;

    IndicatorTypeEnum(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }
}