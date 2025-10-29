package com.tcc.alzheimer.dto.chat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatLastReadUpdateRequestDTO {

    @NotNull(message = "Informe a mensagem que foi lida")
    private Long messageId;
}
