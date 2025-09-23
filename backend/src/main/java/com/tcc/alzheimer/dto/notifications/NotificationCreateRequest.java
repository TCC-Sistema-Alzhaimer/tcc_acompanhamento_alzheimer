package com.tcc.alzheimer.dto.notifications;

import java.util.List;

import com.tcc.alzheimer.model.enums.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record NotificationCreateRequest(
        @NotNull Long senderId,
        @NotBlank NotificationType type,
        @NotBlank String title,
        @NotBlank String message,
        @NotEmpty List<Long> recipientIds) {
}
