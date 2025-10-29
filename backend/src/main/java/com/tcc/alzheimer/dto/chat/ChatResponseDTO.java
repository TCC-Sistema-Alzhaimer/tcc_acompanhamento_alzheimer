package com.tcc.alzheimer.dto.chat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {

    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private ChatMessageResponseDTO lastMessage;
    private Long lastReadMessageId;

    @Builder.Default
    private boolean hasUnreadMessages = false;

    @Builder.Default
    private List<ChatParticipantDTO> participants = new ArrayList<>();
}
