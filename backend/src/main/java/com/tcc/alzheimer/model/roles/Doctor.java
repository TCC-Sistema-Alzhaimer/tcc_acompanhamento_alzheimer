package com.tcc.alzheimer.model.roles;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
public class Doctor extends User {

    @Column(name = "crm", nullable = false, unique = true)
    private String crm;

    @Column(name = "speciality",nullable = false)
    private String speciality;

    @ManyToMany(mappedBy = "doctors")
    private Set<Patient> patients = new HashSet<>();
}
