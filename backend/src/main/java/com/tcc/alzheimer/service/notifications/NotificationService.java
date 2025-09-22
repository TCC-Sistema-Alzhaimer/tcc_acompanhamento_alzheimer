
package com.tcc.alzheimer.service.notifications;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.model.notifications.Notification;
import com.tcc.alzheimer.model.notifications.NotificationRecipient;
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
    public Notification createAndSend(Long senderId, List<Long> recipientIds) {
        var sender = userRepository.findById(senderId)
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        var notification = new Notification();
        notification.setSender(sender);

        // salva primeiro para garantir ID se você usa o construtor que seta IDs
        notification = notificationRepository.save(notification);

        // cria vínculos
        for (Long rid : recipientIds) {
            var recipient = userRepository.findById(rid)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found: " + rid));

            var link = new NotificationRecipient(notification, recipient);
            notification.getRecipients().add(link);
            recipient.getReceived().add(link);
        }

        // como recipients tem cascade = ALL, salvar a notificação persiste os vínculos
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationRecipient> findUnreadByRecipient(Long userId) {
        return notificationRecipientRepository.findUnreadByRecipient(userId);
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        int updated = notificationRecipientRepository.markAsRead(userId, notificationId);
        if (updated == 0) {
            throw new IllegalArgumentException("Vínculo não encontrado para marcar como lido.");
        }
    }
}
