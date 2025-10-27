package com.tcc.alzheimer.repository.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.chat.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
