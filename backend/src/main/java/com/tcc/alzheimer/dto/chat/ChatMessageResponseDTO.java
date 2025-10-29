package com.tcc.alzheimer.dto.chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDTO {

    private Long id;
    private String message;
    private String type;
    private LocalDateTime sentAt;
    private ChatParticipantDTO sender;
}
