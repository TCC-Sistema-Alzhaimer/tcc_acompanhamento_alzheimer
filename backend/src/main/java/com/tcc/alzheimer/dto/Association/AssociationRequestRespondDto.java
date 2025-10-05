package com.tcc.alzheimer.dto.Association;
import com.tcc.alzheimer.model.enums.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssociationRequestRespondDto {
    private String responderEmail;
    private RequestStatus status;
}
