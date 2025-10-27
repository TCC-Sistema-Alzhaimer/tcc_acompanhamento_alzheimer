package com.tcc.alzheimer.dto.chat;

import com.tcc.alzheimer.model.enums.UserType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantDTO {
    private Long id;
    private String name;
    private String email;
    private UserType type;
}
