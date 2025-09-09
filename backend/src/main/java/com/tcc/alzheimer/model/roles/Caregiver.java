package com.tcc.alzheimer.model.roles;

import java.time.LocalDate;
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
public class Caregiver extends User {

    @Column(nullable = false)
    private LocalDate birthdate;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @ManyToMany(mappedBy = "caregivers")
    private Set<Patient> patients = new HashSet<>();
}
