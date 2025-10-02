package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tcc.alzheimer.model.roles.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndActiveTrue(String email);

    Optional<User> findByIdAndActiveTrue(Long id);

    List<User> findByIdInAndActiveTrue(List<Long> ids);

    boolean existsByEmail(String email);

    boolean existsByEmailAndActiveTrue(String email);

    @Query("SELECT u FROM User u WHERE u.active = true AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchActiveByNameOrEmail(String query);

    List<User> findByTypeInAndActiveTrue(List<String> types);

    List<User> findAllByActiveTrue();
}
