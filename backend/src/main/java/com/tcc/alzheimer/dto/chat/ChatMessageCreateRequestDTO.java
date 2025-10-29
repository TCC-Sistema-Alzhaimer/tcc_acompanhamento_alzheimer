package com.tcc.alzheimer.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageCreateRequestDTO {

    @NotBlank(message = "A mensagem é obrigatória")
    @Size(max = 1000, message = "A mensagem deve ter no máximo 1000 caracteres")
    private String message;

    @Size(max = 50, message = "O tipo deve ter no máximo 50 caracteres")
    private String type;
}
