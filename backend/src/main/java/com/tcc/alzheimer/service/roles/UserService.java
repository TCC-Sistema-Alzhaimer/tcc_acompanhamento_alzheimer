package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.roles.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuário com email '" + email + "' não encontrado"
                ));
    }

    public List<BasicDtoForList> getAllUsers() {
        return repo.findAll().stream()
                .map(user -> new BasicDtoForList(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getType()
                ))
                .toList();
    }
}
