package com.alzheimer.tcc.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "conclusions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conclusion {
    @Id
    @Column(name = "exam_id")
    private Integer examId;

    private Integer doctorId;
    private Integer patientId;
    private LocalDate date;
    private String description;
    private String notes;
    private String conclusion;

    @OneToOne
    @MapsId
    @JoinColumn(name = "exam_id")
    private Exam exam;
}
