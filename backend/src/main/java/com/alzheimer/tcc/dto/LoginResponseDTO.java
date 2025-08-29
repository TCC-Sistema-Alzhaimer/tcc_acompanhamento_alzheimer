package com.alzheimer.tcc.dto;

public record LoginResponseDTO(
        String token,
        Long id,
        String email,
        String role) {
}
