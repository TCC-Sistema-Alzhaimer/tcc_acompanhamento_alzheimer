package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.model.enums.UserType;

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

    @Query("SELECT u FROM User u WHERE u.active = true AND u.type = :type AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) "
            +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchActiveByNameOrEmailAndType(@Param("query") String query, @Param("type") UserType type);

    List<User> findByTypeInAndActiveTrue(List<String> types);

    List<User> findAllByActiveTrue();
}
