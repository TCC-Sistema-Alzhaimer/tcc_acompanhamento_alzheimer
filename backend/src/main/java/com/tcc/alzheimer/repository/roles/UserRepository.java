package com.tcc.alzheimer.repository.roles;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.roles.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

