package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;

@Repository
public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {

    List<Caregiver> findByPatients(Patient patient);

    List<Caregiver> findByPatientsAndActiveTrue(Patient patient);

    Optional<Caregiver> findByEmail(String email);

    Optional<Caregiver> findByEmailAndActiveTrue(String email);

    Optional<Caregiver> findByCpf(String cpf);

    Optional<Caregiver> findByIdAndActiveTrue(Long id);

    List<Caregiver> findAllByActiveTrue();
}
