package com.tcc.alzheimer.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String jwt = null;

        // 1️⃣ Tenta pegar do header Authorization por padrao da session
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            System.out.println("[JwtAuthFilter] JWT encontrado no header Authorization: " + jwt);
        }

        // 2️⃣ Se não encontrou no header, tenta pegar do cookie "token"
        if (jwt == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    System.out.println("[JwtAuthFilter] JWT encontrado no cookie 'token': " + jwt);
                    break;
                }
            }
        }

        if (jwt != null) {
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                String username = claims.getSubject();
                String role = claims.get("role", String.class);

                System.out.println("[JwtAuthFilter] Claims extraídas do JWT: username=" + username + ", role=" + role);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    role != null ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                                                 : Collections.emptyList()
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("[JwtAuthFilter] Authentication setado no SecurityContext para usuário: " + username);
                }

            } catch (Exception e) {
                System.out.println("[JwtAuthFilter] JWT inválido: " + e.getMessage());
            }
        } else {
            System.out.println("[JwtAuthFilter] Nenhum JWT encontrado na requisição");
        }

        filterChain.doFilter(request, response);
    }
}
