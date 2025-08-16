package com.tcc.alzheimer.dto;

public record LoginResponseDTO(
        String token,
        Long id,
        String email,
        String role) {
}
