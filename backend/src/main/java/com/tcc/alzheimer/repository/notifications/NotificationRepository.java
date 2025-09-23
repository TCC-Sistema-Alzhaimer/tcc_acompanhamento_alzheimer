package com.tcc.alzheimer.repository.notifications;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.notifications.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    long countBySender_Id(Long senderId);
}
