package com.tcc.alzheimer.model.roles;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Caregiver extends User {

    @Column(nullable = false)
    private LocalDate birthdate;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @ManyToMany(mappedBy = "caregivers")
    @JsonBackReference
    private Set<Patient> patients = new HashSet<>();
}
