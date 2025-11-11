package com.tcc.alzheimer.repository.roles;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByEmailAndActiveTrue(String email);

    Optional<Patient> findByCpf(String cpf);

    Optional<Patient> findByIdAndActiveTrue(Long id);

    List<Patient> findAllByActiveTrue();

    List<Patient> findByCaregivers(Caregiver caregiver);

    List<Patient> findByCaregiversAndActiveTrue(Caregiver caregiver);

    List<Patient> findByDoctors(Doctor doctor);

    List<Patient> findByDoctorsAndActiveTrue(Doctor doctor);
    
    List<Patient> findByDoctorsAndActiveTrueAndNameContainingIgnoreCase(Doctor doctor, String name);

    @Query("""
                SELECT p FROM Patient p
                JOIN p.doctors d
                WHERE d.id = :doctorId
                  AND p.active = true
                  AND (:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
                                     OR LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')))
                  AND (:serviceType IS NULL OR LOWER(p.type) = LOWER(:serviceType))
            """)
    List<Patient> findByDoctorWithFilters(
            @Param("doctorId") Long doctorId,
            @Param("query") String query,
            @Param("serviceType") String serviceType);
}
