package com.tcc.alzheimer.dto.auth;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private Long userId;
    private String newPassword;
}