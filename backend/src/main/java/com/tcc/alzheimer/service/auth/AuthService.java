package com.tcc.alzheimer.service.auth;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.auth.LoginDTO;
import com.tcc.alzheimer.dto.auth.LoginResponseDTO;
import com.tcc.alzheimer.dto.auth.ResetPasswordDTO;
import com.tcc.alzheimer.dto.auth.VerifyUserDTO;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.roles.UserRepository; 
import com.tcc.alzheimer.service.roles.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    private final UserService userService;
    private final UserRepository userRepository; 
    
    private final PasswordEncoder encoder;
    private final Key key;

    public AuthService(
            UserService userService, 
            UserRepository userRepository,
            PasswordEncoder encoder, 
            @Value("${jwt.secret}") String secret) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Login simples (accessToken em storage)
    public LoginResponseDTO loginSessionStorage(LoginDTO dto) {
        User user = validateUser(dto);
        String token = generateAccessToken(user);

        return new LoginResponseDTO(token, user.getId(), user.getEmail(), user.getType());
    }

    // Login com HttpOnly Refresh Token
    public LoginResponseDTO loginHttpOnly(LoginDTO dto, HttpServletResponse response) {
        User user = validateUser(dto);
        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        ResponseCookie accessCookie = ResponseCookie.from("token", accessToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return new LoginResponseDTO(accessToken, user.getId(), user.getEmail(), user.getType());
    }

    public LoginResponseDTO refreshAccessToken(HttpServletRequest request) {
        String refreshToken = extractRefreshToken(request);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

        String email = claims.getSubject();
        User user = userService.findByEmail(email);
        String newAccessToken = generateAccessToken(user);

        return new LoginResponseDTO(newAccessToken, user.getId(), user.getEmail(), user.getType());
    }

    private User validateUser(LoginDTO dto) {
        User user = userService.findByEmail(dto.email());
        if (!encoder.matches(dto.password(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }
        return user;
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getType())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000)) // 30 minutos att
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setExpiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000)) // 7 dias
                .signWith(key)
                .compact();
    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            throw new RuntimeException("No cookies found");

        return Arrays.stream(cookies)
                .filter(c -> c.getName().equals("refreshToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new RuntimeException("Refresh token missing"));
    }

    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return authentication.getName(); 
    }

    public String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElseThrow(() -> new RuntimeException("Role não encontrada para o usuário"));
    }

    public boolean hasRole(String requiredRole) {
        try {
            String currentRole = getCurrentUserRole();
            return requiredRole.equals(currentRole);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public User getCurrentUser() {
        String email = getCurrentUserEmail();
        return userService.findByEmail(email);
    }

   public Long verifyUserForReset(VerifyUserDTO dto) {
        // 1. LIMPEZA DE DADOS (Sanitization)
        // Remove espaços antes/depois do email
        String emailLimpo = dto.getEmail().trim(); 
        
        // Remove tudo que NÃO for número do CPF e remove espaços
        String cpfLimpo = dto.getCpf().replaceAll("\\D", "").trim(); 

        // 2. LOGS DE DEBUG (Olhe o terminal do Docker após tentar)
        System.out.println("========== DEBUG RESET SENHA ==========");
        System.out.println("Recebido do Front -> Email: '" + dto.getEmail() + "' | CPF: '" + dto.getCpf() + "'");
        System.out.println("Buscando no Banco -> Email: '" + emailLimpo + "' | CPF: '" + cpfLimpo + "'");

        // 3. A BUSCA
        User user = userRepository.findByEmailAndCpf(emailLimpo, cpfLimpo)
                .orElseThrow(() -> {
                    System.out.println(">>> FALHA: Nenhuma conta encontrada com esses dados exatos.");
                    return new ResourceNotFoundException("Dados não conferem.");
                });
        
        System.out.println(">>> SUCESSO: Usuário encontrado: " + user.getName() + " (ID: " + user.getId() + ")");
        return user.getId();
    }

    public void resetPassword(ResetPasswordDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        user.setPassword(encoder.encode(dto.getNewPassword())); 
        userRepository.save(user);
    }
}