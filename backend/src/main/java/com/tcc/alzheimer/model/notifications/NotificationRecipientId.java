package com.tcc.alzheimer.model.notifications;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRecipientId implements Serializable {
    private Long notificationId;
    private Long recipientId;
}
