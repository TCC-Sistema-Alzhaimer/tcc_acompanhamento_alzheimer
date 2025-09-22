package com.tcc.alzheimer.repository.notifications;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcc.alzheimer.model.notifications.NotificationRecipient;
import com.tcc.alzheimer.model.notifications.NotificationRecipientId;

import jakarta.transaction.Transactional;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, NotificationRecipientId> {
    // buscar todos os vínculos de um destinatário
    List<NotificationRecipient> findByRecipientId(Long recipientId);

    // não lidas de um destinatário
    List<NotificationRecipient> findByRecipientIdAndReadFlagFalseOrderByNotificationIdDesc(Long recipientId);

    // buscar vínculos de uma notificação específica
    List<NotificationRecipient> findByNotificationIdNotificationId(Long notificationId); // OU faça um @Query

    // JPQL para não lidas (exemplo com @Query)
    @Query("""
        select nr from NotificationRecipient nr
        where nr.recipient.id = :userId and nr.readFlag = false
        order by nr.notification.id desc
    """)
    List<NotificationRecipient> findUnreadByRecipient(@Param("userId") Long userId);

    // marcar como lida
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update NotificationRecipient nr
        set nr.readFlag = true
        where nr.recipient.id = :userId and nr.notification.id = :notificationId
    """)
    int markAsRead(@Param("userId") Long userId, @Param("notificationId") Long notificationId);

    // deletar todos os vínculos de uma notificação (quando removê-la)
    @Modifying
    @Transactional
    int deleteByNotificationIdNotificationId(Long notificationId);
}
