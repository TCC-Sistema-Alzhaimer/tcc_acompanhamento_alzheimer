package com.tcc.alzheimer.dto.roles.doctor;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorGetDto {
    private String cpf;
    private String name;
    private String email;
    private String phone;
    private String crm;
    private String speciality;
    private List<String> patientEmails;
}
