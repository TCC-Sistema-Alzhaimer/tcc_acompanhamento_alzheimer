package com.tcc.alzheimer.controller.notification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.repository.roles.UserRepository;
import com.tcc.alzheimer.service.notifications.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Validated
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody NotificationCreateRequest request) {
        var response = notificationService.createAndSend(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping // get que ira trazer as informacoes das notificacoes do usuario logado
    public ResponseEntity<List<NotificationRecipientResponse>> listUserNotifications(
            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        var responses = notificationService.findByRecipient(user.getId(), unreadOnly);
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<NotificationRecipientResponse>> listNotificationsByPatient(
            @PathVariable Long patientId,
            @RequestParam(name = "unreadOnly", defaultValue = "false") boolean unreadOnly) {

        var responses = notificationService.findByPatient(patientId, unreadOnly);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        notificationService.markAsRead(user.getId(), notificationId);
        return ResponseEntity.noContent().build();
    }
}