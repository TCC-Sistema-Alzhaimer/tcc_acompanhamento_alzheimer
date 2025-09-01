package com.tcc.alzheimer.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.LoginDTO;
import com.tcc.alzheimer.dto.LoginResponseDTO;
import com.tcc.alzheimer.model.roles.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder encoder;
    private final Key key;

    public AuthService(UserService userService, PasswordEncoder encoder, @Value("${jwt.secret}") String secret) {
        this.userService = userService;
        this.encoder = encoder;
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public LoginResponseDTO login(LoginDTO dto) {
        User user = userService.findByEmail(dto.email());

        if (!encoder.matches(dto.password(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getType())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();

        return new LoginResponseDTO(
                token,
                user.getId(),
                user.getEmail(),
                user.getType());
    }
}
