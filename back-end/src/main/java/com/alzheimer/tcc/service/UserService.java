package com.alzheimer.tcc.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alzheimer.tcc.dto.UserDTO;
import com.alzheimer.tcc.dto.UserRegisterDTO;
import com.alzheimer.tcc.exception.ResourceConflictException;
import com.alzheimer.tcc.exception.ResourceNotFoundException;
import com.alzheimer.tcc.model.User;
import com.alzheimer.tcc.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com email '" + email + "' não encontrado"));
    }

    public UserDTO register(UserRegisterDTO dto) {
        if (repo.existsByEmail(dto.email())) {
            throw new ResourceConflictException("Email já cadastrado");
        }

        User user = new User();
        user.setEmail(dto.email());
        user.setPassword(encoder.encode(dto.password()));
        repo.save(user);

        return new UserDTO(user.getId(), user.getEmail(), user.getRole());
    }
}
