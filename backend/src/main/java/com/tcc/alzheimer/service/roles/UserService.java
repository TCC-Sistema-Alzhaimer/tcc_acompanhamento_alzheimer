package com.tcc.alzheimer.service.roles;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.roles.UserDTO;
import com.tcc.alzheimer.dto.roles.UserRegisterDTO;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.roles.UserRepository;


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

        return new UserDTO(user.getId(), user.getEmail(), user.getType());
    }
}
