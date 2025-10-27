package com.tcc.alzheimer.dto.chat;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantsAddRequestDTO {

    @NotEmpty(message = "Informe ao menos um participante para adicionar")
    @Size(max = 50, message = "É possível adicionar no máximo 50 participantes por vez")
    private List<Long> participantIds = new ArrayList<>();
}
