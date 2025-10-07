package com.tcc.alzheimer.model.files;

import com.tcc.alzheimer.model.roles.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "files")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @NotBlank
    private String name;

    @Column(name = "extension", nullable = false)
    @NotBlank
    private String extension;

    @Column(name = "random_name", nullable = false, unique = true)
    @NotBlank
    private String randomName;

    @Column(name = "size", nullable = false)
    @NotNull
    private Long size;

    @Column(name = "creation_date", nullable = false)
    @NotNull
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name = "added_by_user_id", nullable = false)
    @NotNull
    private User addedBy;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}