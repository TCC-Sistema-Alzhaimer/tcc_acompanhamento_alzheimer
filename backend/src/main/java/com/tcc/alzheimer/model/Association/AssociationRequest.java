package com.tcc.alzheimer.model.Association;

import java.time.LocalDateTime;

import com.tcc.alzheimer.model.enums.RequestStatus;
import com.tcc.alzheimer.model.enums.RequestType;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.model.roles.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssociationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sempre terá um paciente como âncora
    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // Pode ser médico ou cuidador dependendo do tipo
    @ManyToOne(optional = false)
    @JoinColumn(name = "relation_id")
    private User relation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime respondedAt;

    // Quem criou a solicitação
    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id")
    private User creator;

    // Quem respondeu (se houver)
    @ManyToOne
    @JoinColumn(name = "responder_id")
    private User responder;
}

