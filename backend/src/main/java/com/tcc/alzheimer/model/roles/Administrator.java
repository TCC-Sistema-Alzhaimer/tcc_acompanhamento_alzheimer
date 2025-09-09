package com.tcc.alzheimer.model.roles;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true) // garante que usa os atributos da superclasse User
public class Administrator extends User {
}
