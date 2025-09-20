package com.tcc.alzheimer.model.exams;

import com.tcc.alzheimer.model.files.File;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "exam_results")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @NotNull
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "file_id", nullable = false)
    @NotNull
    private File file;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}