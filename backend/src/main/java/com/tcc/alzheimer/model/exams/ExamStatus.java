package com.tcc.alzheimer.model.exams;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exam_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamStatus {

    @Id
    private String id;

    @Column(name = "description", nullable = false)
    private String description;

}
