package com.tcc.alzheimer.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    // Exemplo de query extra:
    Doctor findByCrm(String crm);
}
