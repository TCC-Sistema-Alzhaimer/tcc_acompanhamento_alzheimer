package com.tcc.alzheimer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.List;

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
