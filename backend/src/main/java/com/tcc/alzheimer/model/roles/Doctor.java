package com.tcc.alzheimer.model.roles;

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
public class Doctor extends User {

    @Column(name = "crm", nullable = false, unique = true)
    private String crm;

    @Column(name = "speciality",nullable = false)
    private String speciality;

    @ManyToMany(mappedBy = "doctors")
    @JsonBackReference
    private Set<Patient> patients = new HashSet<>();

}