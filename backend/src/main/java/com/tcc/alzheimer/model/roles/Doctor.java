package com.tcc.alzheimer.model.roles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

}