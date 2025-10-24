package com.tcc.alzheimer.service.notifications;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.notifications.NotificationCreateRequest;
import com.tcc.alzheimer.dto.notifications.NotificationRecipientResponse;
import com.tcc.alzheimer.dto.notifications.NotificationResponse;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.notifications.Notification;
import com.tcc.alzheimer.model.notifications.NotificationRecipient;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.notifications.NotificationRecipientRepository;
import com.tcc.alzheimer.repository.notifications.NotificationRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final NotificationRecipientRepository notificationRecipientRepository;
        private final UserRepository userRepository;

        @Transactional
        public NotificationResponse createAndSend(NotificationCreateRequest request) {
                var sender = userRepository.findByIdAndActiveTrue(request.senderId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Remetente com id %d nao encontrado.".formatted(request.senderId())));

                Set<Long> recipientIds = request.recipientIds().stream()
                                .filter(Objects::nonNull)
                                .filter(id -> !Objects.equals(id, sender.getId()))
                                .collect(Collectors.toSet());

                if (recipientIds.isEmpty()) {
                        throw new IllegalArgumentException("Informe ao menos um destinatario valido.");
                }

                List<User> recipients = userRepository.findByIdInAndActiveTrue(new ArrayList<>(recipientIds));
                if (recipients.size() != recipientIds.size()) {
                        var foundIds = recipients.stream().map(User::getId).collect(Collectors.toSet());
                        var missing = recipientIds.stream()
                                        .filter(id -> !foundIds.contains(id))
                                        .sorted()
                                        .toList();
                        throw new ResourceNotFoundException("Destinatarios nao encontrados: " + missing);
                }

                var notification = new Notification();
                notification.setSender(sender);
                notification.setTitle(request.title());
                notification.setMessage(request.message());
                notification.setType(request.type());

                if (request.associationId() != null) {
                        var association = new com.tcc.alzheimer.model.Association.AssociationRequest();
                        association.setId(request.associationId());
                        notification.setAssociation(association);
                }

                notification = notificationRepository.save(notification);

                for (User recipient : recipients) {
                        var link = new NotificationRecipient(notification, recipient);
                        notification.addRecipient(link);
                        recipient.getReceived().add(link);
                }

                notification = notificationRepository.save(notification);

                return toNotificationResponse(notification);
        }

        @Transactional(readOnly = true)
        public List<NotificationRecipientResponse> findByRecipient(Long userId, boolean unreadOnly) {
                var results = unreadOnly
                                ? notificationRecipientRepository.findUnreadByRecipient(userId)
                                : notificationRecipientRepository.findAllByRecipient(userId);

                return results.stream()
                                .map(this::toRecipientResponse)
                                .toList();
        }

        @Transactional
        public void markAsRead(Long userId, Long notificationId) {
                int updated = notificationRecipientRepository.markAsRead(userId, notificationId);
                if (updated == 0) {
                        throw new ResourceNotFoundException(
                                        "Nao foi possivel marcar a notificacao como lida. Verifique os identificadores informados.");
                }
        }

        private NotificationResponse toNotificationResponse(Notification notification) {
                var sender = notification.getSender();
                var senderSummary = new NotificationResponse.UserSummary(
                                sender.getId(),
                                sender.getName(),
                                sender.getEmail());

                var recipients = notification.getRecipients().stream()
                                .map(link -> new NotificationResponse.RecipientStatus(
                                                link.getRecipient().getId(),
                                                link.getRecipient().getName(),
                                                link.getRecipient().getEmail(),
                                                link.isReadFlag(),
                                                link.getReadAt()))
                                .sorted(Comparator.comparing(NotificationResponse.RecipientStatus::id))
                                .toList();

                return new NotificationResponse(
                                notification.getId(),
                                notification.getTitle(),
                                notification.getMessage(),
                                notification.getCreatedAt(),
                                senderSummary,
                                recipients);
        }

        private NotificationRecipientResponse toRecipientResponse(NotificationRecipient link) {
                var notification = link.getNotification();
                var sender = notification.getSender();

                return new NotificationRecipientResponse(
                                notification.getId(),
                                link.getRecipient().getId(),
                                notification.getTitle(),
                                notification.getMessage(),
                                notification.getCreatedAt(),
                                notification.getType().name(),
                                notification.getExam() != null ? notification.getExam().getId() : null,
                                notification.getAssociation() != null ? notification.getAssociation().getId() : null,
                                link.isReadFlag(),
                                link.getReadAt(),
                                new NotificationRecipientResponse.UserSummary(
                                                sender.getId(),
                                                sender.getName(),
                                                sender.getEmail()));
        }

        @Transactional(readOnly = true)
        public List<NotificationRecipientResponse> findByPatient(Long patientId, boolean unreadOnly) {
                var patient = userRepository.findById(patientId)
                                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado."));
                var results = unreadOnly
                                ? notificationRecipientRepository.findUnreadByRecipient(patient.getId())
                                : notificationRecipientRepository.findAllByRecipient(patient.getId());
                return results.stream()
                                .map(this::toRecipientResponse)
                                .toList();
        }
}
