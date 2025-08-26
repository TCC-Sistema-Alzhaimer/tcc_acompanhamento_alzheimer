package com.alzheimer.tcc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.alzheimer.tcc.dto.UserDTO;
import com.alzheimer.tcc.dto.UserRegisterDTO;
import com.alzheimer.tcc.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid UserRegisterDTO dto) {
        return ResponseEntity.ok(service.register(dto));
    }
}
