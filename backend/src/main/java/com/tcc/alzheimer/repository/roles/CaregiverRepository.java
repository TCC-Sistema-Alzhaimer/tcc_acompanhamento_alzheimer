package com.tcc.alzheimer.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcc.alzheimer.model.roles.Caregiver;

@Repository
public interface CaregiverRepository extends JpaRepository<Caregiver, Long> {
}
