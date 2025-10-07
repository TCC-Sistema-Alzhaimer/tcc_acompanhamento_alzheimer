package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByEmailAndActiveTrue(String email);

    Optional<Doctor> findByCpf(String cpf);

    Optional<Doctor> findByCrm(String crm);

    Optional<Doctor> findByIdAndActiveTrue(Long id);

    List<Doctor> findAllByActiveTrue();

    List<Doctor> findByPatients(Patient patient);

    List<Doctor> findByPatientsAndActiveTrue(Patient patient);
}
