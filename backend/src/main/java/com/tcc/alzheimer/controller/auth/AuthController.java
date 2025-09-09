package com.tcc.alzheimer.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.auth.LoginDTO;
import com.tcc.alzheimer.dto.auth.LoginResponseDTO;
import com.tcc.alzheimer.service.auth.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/login_session")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginDTO dto) {
        return ResponseEntity.ok(authService.loginSessionStorage(dto));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginHttpOnly(@RequestBody @Valid LoginDTO dto,
                                                          HttpServletResponse response) {
        return ResponseEntity.ok(authService.loginHttpOnly(dto, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(HttpServletRequest request) {
        return ResponseEntity.ok(authService.refreshAccessToken(request));
    }
}
