package com.tcc.alzheimer.dto;
import java.time.LocalDate;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {
    private Long id;
    private String name;
    private String cpf;
    private String email;
    private String phone;
    private String gender;
    private String address;
    private LocalDate birthdate;
    private List<String> doctorEmails;
    private List<String> caregiverEmails;

}
