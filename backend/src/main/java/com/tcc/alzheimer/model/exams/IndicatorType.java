package com.tcc.alzheimer.model.exams;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "indicator_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndicatorType {

    @Id
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

}
