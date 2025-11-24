package com.tcc.alzheimer.model.notifications;

import java.time.LocalDateTime;

import com.tcc.alzheimer.model.roles.User;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "notification_recipient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NotificationRecipient {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private NotificationRecipientId id = new NotificationRecipientId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("notificationId")
    @JoinColumn(name = "notification_id", nullable = false)
    @ToString.Exclude
    private Notification notification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("recipientId")
    @JoinColumn(name = "recipient_id", nullable = false)
    @ToString.Exclude
    private User recipient;

    @Column(name = "read_flag", nullable = false)
    private boolean readFlag = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    public NotificationRecipient(Notification notification, User recipient) {
        this.notification = notification;
        this.recipient = recipient;
        this.id = new NotificationRecipientId(notification.getId(), recipient.getId());
    }

    public void markAsRead() {
        if (!readFlag) {
            this.readFlag = true;
            this.readAt = LocalDateTime.now();
        }
    }
}
