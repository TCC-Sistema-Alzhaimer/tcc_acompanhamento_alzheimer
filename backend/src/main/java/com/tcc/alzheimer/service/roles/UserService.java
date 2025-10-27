package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.roles.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

        private final UserRepository repo;

        public User findByEmail(String email) {
                return repo.findByEmailAndActiveTrue(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario com email '" + email + "' nao encontrado"));
        }

        public List<BasicDtoForList> getAllUsers() {
                return repo.findAllByActiveTrue().stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

        public List<BasicDtoForList> searchUsers(String query) {
                return repo.searchActiveByNameOrEmail(query).stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

        public List<BasicDtoForList> getPatientsAndCaregivers() {
                return repo.findByTypeInAndActiveTrue(List.of(UserType.PATIENT.name(), UserType.CAREGIVER.name())).stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

}
