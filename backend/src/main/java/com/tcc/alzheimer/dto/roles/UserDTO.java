package com.tcc.alzheimer.dto.roles;

import com.tcc.alzheimer.model.enums.UserType;

public record UserDTO(
        Long id,
        String email,
        UserType role) {
}
