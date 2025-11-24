package com.tcc.alzheimer.model.exams;

import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "conclusion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conclusion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "conclusion", columnDefinition = "TEXT", nullable = false)
    private String conclusion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @ManyToMany
    @JoinTable(name = "conclusion_files", joinColumns = @JoinColumn(name = "conclusion_id"), inverseJoinColumns = @JoinColumn(name = "file_id"))
    private Set<com.tcc.alzheimer.model.files.File> files = new java.util.HashSet<>();

}
