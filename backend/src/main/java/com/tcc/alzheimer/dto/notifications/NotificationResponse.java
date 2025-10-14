package com.tcc.alzheimer.dto.notifications;

import java.time.LocalDateTime;
import java.util.List;


public record NotificationResponse(
        Long id,
        String title,
        String message,
        LocalDateTime createdAt,
        UserSummary sender,
        List<RecipientStatus> recipients) {

    public record UserSummary(Long id, String name, String email) {
    }

    public record RecipientStatus(Long id, String name, String email, boolean read, LocalDateTime readAt) {
    }
}
