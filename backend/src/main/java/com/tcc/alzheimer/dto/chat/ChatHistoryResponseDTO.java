package com.tcc.alzheimer.dto.chat;

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
public class ChatHistoryResponseDTO {

    private ChatResponseDTO chat;

    @Builder.Default
    private List<ChatMessageResponseDTO> messages = new ArrayList<>();
}
