package com.tcc.alzheimer.dto.roles;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegisterDTO(
        @Email @NotBlank String email,
        @NotBlank String password) {
}
