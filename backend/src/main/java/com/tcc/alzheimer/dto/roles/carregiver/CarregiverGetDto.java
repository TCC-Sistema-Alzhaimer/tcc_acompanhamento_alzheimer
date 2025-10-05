package com.tcc.alzheimer.dto.roles.carregiver;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarregiverGetDto {
    private String cpf;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private String gender;
    private String address;
    private List<String> patientEmails; // Lista de emails de pacientes atribuídos
}
