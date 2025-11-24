package com.tcc.alzheimer.repository.notifications;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tcc.alzheimer.model.notifications.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    long countBySender_Id(Long senderId);

    List<Notification> findBySender_Id(Long senderId);

    List<Notification> findByExamId(Long examId);

    @Query(value = """
        SELECT n.*
        FROM public.notification n
        LEFT JOIN public.tb_requests r ON n.association_id = r.id
        LEFT JOIN public.exam e ON n.exam_id = e.id
        WHERE r.patient_id = :patientId
           OR e.patient_id = :patientId
        ORDER BY n.id DESC
        """, nativeQuery = true
    )
    List<Notification> findByPatientId(@Param("patientId") Long patientId);
}
