package com.tcc.alzheimer.dto.roles;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientUpdateDTO {

    private String name;
    private String cpf;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private String gender;
    private String address;
    private String password;
    private List<String> doctorEmails;
    private List<String> caregiverEmails;
}
