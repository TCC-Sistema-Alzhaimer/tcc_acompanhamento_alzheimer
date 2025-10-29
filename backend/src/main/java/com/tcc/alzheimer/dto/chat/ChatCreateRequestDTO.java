package com.tcc.alzheimer.dto.chat;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatCreateRequestDTO {

    @NotBlank(message = "O nome do chat é obrigatório")
    @Size(max = 120, message = "O nome do chat deve ter no máximo 120 caracteres")
    private String name;

    @Size(max = 50, message = "Um chat pode ser criado com no máximo 50 participantes adicionais")
    private List<Long> participantIds = new ArrayList<>();
}
