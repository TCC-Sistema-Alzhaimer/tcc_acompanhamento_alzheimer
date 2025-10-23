package com.tcc.alzheimer.repository.Association;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcc.alzheimer.model.Association.AssociationRequest;
import com.tcc.alzheimer.model.roles.User;

public interface AssociationRequestRepository extends JpaRepository<AssociationRequest, Long> {
    List<AssociationRequest> findByCreator(User user);
    List<AssociationRequest> findByResponder(User user);
    List<AssociationRequest> findByPatient(User user);
    List<AssociationRequest> findByRelation(User user);
    @Query("SELECT DISTINCT r FROM AssociationRequest r JOIN r.patient.caregivers c WHERE c = :user")
    List<AssociationRequest> findByCaregiver(@Param("user") User user);
}
