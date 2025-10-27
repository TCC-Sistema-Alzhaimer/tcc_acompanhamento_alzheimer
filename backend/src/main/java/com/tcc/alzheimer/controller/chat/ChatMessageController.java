package com.tcc.alzheimer.controller.chat;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.chat.ChatMessageCreateRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatLastReadUpdateRequestDTO;
import com.tcc.alzheimer.dto.chat.ChatMessageResponseDTO;
import com.tcc.alzheimer.service.chat.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/chats/{chatId}/messages")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<Page<ChatMessageResponseDTO>> listMessages(
            @PathVariable Long chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ChatMessageResponseDTO> response = chatService.listMessages(chatId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/new")
    public ResponseEntity<List<ChatMessageResponseDTO>> listNewMessages(
            @PathVariable Long chatId,
            @RequestParam(name = "afterMessageId") Long afterMessageId) {
        List<ChatMessageResponseDTO> response = chatService.listMessagesAfter(chatId, afterMessageId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ChatMessageResponseDTO> sendMessage(@PathVariable Long chatId,
            @Valid @RequestBody ChatMessageCreateRequestDTO request) {
        ChatMessageResponseDTO response = chatService.sendMessage(chatId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/read")
    public ResponseEntity<Void> updateLastRead(
            @PathVariable Long chatId,
            @Valid @RequestBody ChatLastReadUpdateRequestDTO request) {
        chatService.updateLastReadMessage(chatId, request.getMessageId());
        return ResponseEntity.noContent().build();
    }
}
