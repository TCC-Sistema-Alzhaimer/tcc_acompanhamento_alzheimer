package com.tcc.alzheimer.model.notifications;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRecipientId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "notification_id")
    private Long notificationId;

    @Column(name = "recipient_id")
    private Long recipientId;
}
