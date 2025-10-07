package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Administrator;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {

    Optional<Administrator> findByEmail(String email);

    Optional<Administrator> findByEmailAndActiveTrue(String email);

    Optional<Administrator> findByCpf(String cpf);

    Optional<Administrator> findByIdAndActiveTrue(Long id);

    List<Administrator> findAllByActiveTrue();
}
