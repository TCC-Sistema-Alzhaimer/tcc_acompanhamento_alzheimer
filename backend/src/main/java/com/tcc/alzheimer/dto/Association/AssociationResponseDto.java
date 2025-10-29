package com.tcc.alzheimer.dto.Association;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tcc.alzheimer.model.Association.AssociationRequest;
import com.tcc.alzheimer.model.enums.RequestStatus;
import com.tcc.alzheimer.model.enums.RequestType;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssociationResponseDto {

    private Long id;
    private ParticipantSummary patient;
    private ParticipantSummary relation;
    private RequestType type;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    private String creatorEmail;
    private String responderEmail;

    public AssociationResponseDto(
            Long id,
            Long patientId,
            String patientName,
            String patientEmail,
            UserType patientType,
            Long relationId,
            String relationName,
            String relationEmail,
            UserType relationType,
            RequestType type,
            RequestStatus status,
            LocalDateTime createdAt,
            LocalDateTime respondedAt,
            String creatorEmail,
            String responderEmail) {
        this.id = id;
        this.patient = new ParticipantSummary(patientId, patientName, patientEmail, patientType);
        this.relation = new ParticipantSummary(relationId, relationName, relationEmail, relationType);
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.respondedAt = respondedAt;
        this.creatorEmail = creatorEmail;
        this.responderEmail = responderEmail;
    }

    public static AssociationResponseDto from(AssociationRequest request) {
        User responder = request.getResponder();
        return new AssociationResponseDto(
                request.getId(),
                request.getPatient().getId(),
                request.getPatient().getName(),
                request.getPatient().getEmail(),
                request.getPatient().getType(),
                request.getRelation().getId(),
                request.getRelation().getName(),
                request.getRelation().getEmail(),
                request.getRelation().getType(),
                request.getType(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getRespondedAt(),
                request.getCreator().getEmail(),
                responder != null ? responder.getEmail() : null
        );
    }

    @Data
    @AllArgsConstructor
    public static class ParticipantSummary {
        private Long id;
        private String name;
        private String email;
        private UserType userType;
    }
}
