package com.tcc.alzheimer.model.roles;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
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
public class Patient extends User {

    @Column(nullable = false)
    private LocalDate birthdate;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @ManyToMany
    @JoinTable(
        name = "patient_caregiver",
        joinColumns = @JoinColumn(name = "patient_id"),
        inverseJoinColumns = @JoinColumn(name = "caregiver_id")
    )
    @JsonManagedReference
    private Set<Caregiver> caregivers = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "patient_doctor",
        joinColumns = @JoinColumn(name = "patient_id"),
        inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    @JsonManagedReference
    private Set<Doctor> doctors = new HashSet<>();
}
