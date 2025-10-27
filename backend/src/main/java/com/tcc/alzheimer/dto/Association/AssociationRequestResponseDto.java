package com.tcc.alzheimer.dto.Association;

import java.time.LocalDateTime;

import com.tcc.alzheimer.model.enums.RequestStatus;
import com.tcc.alzheimer.model.enums.RequestType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AssociationRequestResponseDto {
    private Long id;
    private String patientEmail;
    private String relationEmail;
    private RequestType type;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    private String creatorEmail;
    private String responderEmail;
}
