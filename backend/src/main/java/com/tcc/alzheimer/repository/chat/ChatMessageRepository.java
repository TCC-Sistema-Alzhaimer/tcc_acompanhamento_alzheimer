package com.tcc.alzheimer.repository.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.chat.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByChatIdOrderBySentAtAsc(Long chatId, Pageable pageable);

    List<ChatMessage> findByChatIdAndIdGreaterThanOrderBySentAtAsc(Long chatId, Long messageId);

    Optional<ChatMessage> findFirstByChatIdOrderBySentAtDescIdDesc(Long chatId);
}
