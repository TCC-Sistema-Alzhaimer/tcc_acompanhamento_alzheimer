package com.tcc.alzheimer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.List;
@Entity
@Table(name = "exam_file")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer patientId;
    private String file;
    private String instructions;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @OneToMany(mappedBy = "examFile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Indicator> indicators;
}
