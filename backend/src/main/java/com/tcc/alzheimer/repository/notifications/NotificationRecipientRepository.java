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

    List<NotificationRecipient> findByRecipient_Id(Long recipientId);

    List<NotificationRecipient> findByRecipient_IdAndReadFlagFalseOrderByNotification_CreatedAtDesc(Long recipientId);

    List<NotificationRecipient> findByNotification_Id(Long notificationId);

    @Query("""
        select nr from NotificationRecipient nr
        join fetch nr.notification n
        join fetch nr.recipient r
        join fetch n.sender s
        where nr.recipient.id = :userId
        order by n.createdAt desc
    """)
    List<NotificationRecipient> findAllByRecipient(@Param("userId") Long userId);

    @Query("""
        select nr from NotificationRecipient nr
        join fetch nr.notification n
        join fetch nr.recipient r
        join fetch n.sender s
        where nr.recipient.id = :userId and nr.readFlag = false
        order by n.createdAt desc
    """)
    List<NotificationRecipient> findUnreadByRecipient(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update NotificationRecipient nr
        set nr.readFlag = true, nr.readAt = CURRENT_TIMESTAMP
        where nr.recipient.id = :userId and nr.notification.id = :notificationId
    """)
    int markAsRead(@Param("userId") Long userId, @Param("notificationId") Long notificationId);

    @Modifying
    @Transactional
    int deleteByNotification_Id(Long notificationId);
}
