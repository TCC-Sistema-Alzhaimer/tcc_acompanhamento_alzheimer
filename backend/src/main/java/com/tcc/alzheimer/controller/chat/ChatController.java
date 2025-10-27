package com.tcc.alzheimer.controller.chat;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.chat.ChatCreateRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatParticipantsAddRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatParticipantDTO;
import com.tcc.alzheimer.dto.chat.ChatResponseDTO;
import com.tcc.alzheimer.service.chat.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDTO> createChat(@Valid @RequestBody ChatCreateRequestDTO request) {
        ChatResponseDTO response = chatService.createChat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{chatId}/participants")
    public ResponseEntity<ChatResponseDTO> addParticipants(@PathVariable Long chatId,
            @Valid @RequestBody ChatParticipantsAddRequestDTO request) {
        ChatResponseDTO response = chatService.addParticipants(chatId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ChatResponseDTO>> listMyChats() {
        return ResponseEntity.ok(chatService.listMyChats());
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatResponseDTO> getChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getChat(chatId));
    }

    @GetMapping("/{chatId}/participants")
    public ResponseEntity<List<ChatParticipantDTO>> listParticipants(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.listParticipants(chatId));
    }

}
