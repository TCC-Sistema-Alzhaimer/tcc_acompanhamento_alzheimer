package com.tcc.alzheimer.dto;import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorResponseDto {
    private String cpf;
    private String name;
    private String email;
    private String phone;
    private String crm;
    private String speciality;
    private List<String> patientEmails; // só emails ou IDs
}

