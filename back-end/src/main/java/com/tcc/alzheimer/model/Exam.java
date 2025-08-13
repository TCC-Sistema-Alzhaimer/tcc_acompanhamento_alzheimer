package com.tcc.alzheimer.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "exam")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer doctorId;
    private Integer patientId;
    private String type;
    private LocalDate requestDate;
    private String result;
    private String note;
    private String status;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExamFile> examFiles;

    @OneToMany(mappedBy = "examFile.exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @Transient // se quiser simplificar, senão pode remover
    private List<Indicator> indicators; // relação indireta via ExamFile

    @OneToOne(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    private Conclusion conclusion;
}

