package com.tcc.alzheimer.controller.notification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.notifications.NotificationCreateRequest;
import com.tcc.alzheimer.dto.notifications.NotificationRecipientResponse;
import com.tcc.alzheimer.dto.notifications.NotificationResponse;
import com.tcc.alzheimer.service.notifications.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Validated
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationCreateRequest request) {
        var response = notificationService.createAndSend(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/recipients/{recipientId}")
    public ResponseEntity<List<NotificationRecipientResponse>> listByRecipient(
            @PathVariable Long recipientId,
            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly) {
        var responses = notificationService.findByRecipient(recipientId, unreadOnly);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{notificationId}/recipients/{recipientId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            @PathVariable Long recipientId) {
        notificationService.markAsRead(recipientId, notificationId);
        return ResponseEntity.noContent().build();
    }
}
