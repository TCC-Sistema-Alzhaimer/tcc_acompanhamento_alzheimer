package com.tcc.alzheimer.dto.Association;
import com.tcc.alzheimer.model.enums.RequestType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssociationRequestCreateDto {
    private String creatorEmail;
    private String patientEmail;
    private String relationEmail; 
    private RequestType type;
}
