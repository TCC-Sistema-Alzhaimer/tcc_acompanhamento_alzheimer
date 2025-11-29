package com.tcc.alzheimer.dto.auth;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VerifyUserDTO {
    private String email;
    private String cpf;
    private LocalDate birthdate;
}