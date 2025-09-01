package com.tcc.alzheimer.dto;

import java.time.LocalDate;
import java.util.List;

import com.tcc.alzheimer.model.enums.UserType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private String cpf;
    private String name;
    private String email;
    private String phone;
    private String password;
    private LocalDate birthdate;
    private String gender;
    private String address;
    private List<String> doctorEmails;      
    private List<String> caregiverEmails;
    private UserType userType = UserType.PATIENT;
}
