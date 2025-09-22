package com.tcc.alzheimer.model.notifications;

import com.tcc.alzheimer.model.roles.User;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_recipient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRecipient {
    @EmbeddedId
    private NotificationRecipientId id = new NotificationRecipientId();

    @ManyToOne
    @MapsId("notificationId")
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @ManyToOne
    @MapsId("recipientId")
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private Boolean readFlag;

    public NotificationRecipient(Notification notification, User recipient) {
        this.notification = notification;
        this.recipient = recipient;
        this.id = new NotificationRecipientId(
            notification.getId(), 
            recipient.getId()
        );
        this.readFlag = false;
    }
}
