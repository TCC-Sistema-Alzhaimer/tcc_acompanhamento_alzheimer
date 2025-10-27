package com.tcc.alzheimer.repository.Association;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcc.alzheimer.model.Association.AssociationRequest;
import com.tcc.alzheimer.model.roles.User;

public interface AssociationRequestRepository extends JpaRepository<AssociationRequest, Long> {

    List<AssociationRequest> findByPatientId(Long patientId);

    @Query("SELECT r FROM AssociationRequest r " +
           "WHERE r.creator = :user OR r.responder = :user OR r.patient = :user OR r.relation = :user")
    List<AssociationRequest> findAllVisibleToUser(@Param("user") User user);
}
