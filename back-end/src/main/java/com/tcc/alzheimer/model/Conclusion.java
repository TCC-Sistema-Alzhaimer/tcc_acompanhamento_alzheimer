package com.tcc.alzheimer.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

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
