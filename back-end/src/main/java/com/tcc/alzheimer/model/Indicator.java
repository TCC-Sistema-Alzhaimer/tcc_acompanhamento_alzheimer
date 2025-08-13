package com.tcc.alzheimer.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "indicator")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Indicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer patientId;
    private String type;
    private String value;
    private LocalDate date;
    private String description;

    @ManyToOne
    @JoinColumn(name = "exam_file_id", nullable = false)
    private ExamFile examFile;

    @ManyToOne
    @JoinColumn(name = "medical_history_id")
    private MedicalHistory medicalHistory;
}
