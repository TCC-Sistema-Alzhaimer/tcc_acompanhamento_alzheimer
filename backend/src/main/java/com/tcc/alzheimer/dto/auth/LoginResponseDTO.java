package com.tcc.alzheimer.dto.auth;
import com.tcc.alzheimer.model.enums.UserType;
public record LoginResponseDTO(
        String token,
        Long id,
        String email,
        UserType role) {
}
