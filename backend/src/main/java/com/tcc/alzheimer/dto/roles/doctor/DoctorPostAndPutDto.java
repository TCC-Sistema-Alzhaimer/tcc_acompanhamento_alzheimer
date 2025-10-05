package com.tcc.alzheimer.dto.roles.doctor;

import java.util.List;

import com.tcc.alzheimer.model.enums.UserType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPostAndPutDto {
    private String cpf;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String crm;
    private String speciality;
    private List<String> patientEmails;
    private UserType userType = UserType.DOCTOR;
}
