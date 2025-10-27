package com.tcc.alzheimer.repository.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.chat.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatIdOrderBySentAtAsc(Long chatId);
}
