package com.tcc.alzheimer.dto.notifications;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public record NotificationResponse(
        Long id,
        String title,
        String message,
        LocalDateTime createdAt,
        UserSummary sender,
        Optional<Long> examId,
        Optional<Long> associationId,
        List<RecipientStatus> recipients) {

    public NotificationResponse(Long id2, String title2, String message2, LocalDateTime createdAt2, Optional<?> examId2,
            Optional<?> associationId2, UserSummary senderSummary, List<RecipientStatus> recipients2) {
        this(id2, title2, message2, createdAt2, senderSummary, examId2.map(o -> (Long) o), associationId2.map(o -> (Long) o), recipients2);
    }

    public record UserSummary(Long id, String name, String email) {
    }

    public record RecipientStatus(Long id, String name, String email, boolean read, LocalDateTime readAt) {
    }
}
