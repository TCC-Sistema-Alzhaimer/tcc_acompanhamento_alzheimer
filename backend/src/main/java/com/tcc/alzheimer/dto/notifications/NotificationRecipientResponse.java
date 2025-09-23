package com.tcc.alzheimer.dto.notifications;

import java.time.LocalDateTime;

public record NotificationRecipientResponse(
        Long notificationId,
        Long recipientId,
        String title,
        String message,
        LocalDateTime createdAt,
        boolean read,
        LocalDateTime readAt,
        UserSummary sender) {

    public record UserSummary(Long id, String name, String email) {
    }
}
