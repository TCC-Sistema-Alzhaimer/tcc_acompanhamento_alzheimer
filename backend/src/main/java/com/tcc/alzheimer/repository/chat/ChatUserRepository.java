package com.tcc.alzheimer.repository.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.chat.ChatUser;

public interface ChatUserRepository extends JpaRepository<ChatUser, Long> {

    List<ChatUser> findByChatId(Long chatId);

    List<ChatUser> findByUserId(Long userId);

    Optional<ChatUser> findByChatIdAndUserId(Long chatId, Long userId);

    boolean existsByChatIdAndUserId(Long chatId, Long userId);
}
