package com.tcc.alzheimer.service.Association;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.Association.AssociationRequestCreateDto;
import com.tcc.alzheimer.dto.Association.AssociationRequestRespondDto;
import com.tcc.alzheimer.dto.Association.AssociationResponseDto;
import com.tcc.alzheimer.dto.notifications.NotificationCreateRequest;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.Association.AssociationRequest;
import com.tcc.alzheimer.model.enums.NotificationType;
import com.tcc.alzheimer.model.enums.RequestStatus;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.Association.AssociationRequestRepository;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;
import com.tcc.alzheimer.service.notifications.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssociationRequestService {

    private final AssociationRequestRepository repo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final CaregiverRepository caregiverRepo;
    private final NotificationService notificationService;

    public AssociationResponseDto create(AssociationRequestCreateDto dto) {
        User creator = userRepo.findByEmailAndActiveTrue(dto.getCreatorEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        Patient patient = patientRepo.findByEmailAndActiveTrue(dto.getPatientEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        User relation = userRepo.findByEmailAndActiveTrue(dto.getRelationEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Relation not found"));

        AssociationRequest request = new AssociationRequest();
        request.setCreator(creator);
        request.setPatient(patient);
        request.setRelation(relation);
        request.setType(dto.getType());
        request.setStatus(RequestStatus.PENDENTE);
        request.setCreatedAt(LocalDateTime.now());

        repo.save(request);
        sendCreationNotification(request);
        return AssociationResponseDto.from(request);
    }

    @Transactional
    public AssociationResponseDto respond(Long id, AssociationRequestRespondDto dto) {
        AssociationRequest request = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        User responder = userRepo.findByEmailAndActiveTrue(dto.getResponderEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Responder not found"));

        validateResponderPermission(request, responder);

        request.setResponder(responder);
        request.setRespondedAt(LocalDateTime.now());
        request.setStatus(dto.getStatus());

        if (dto.getStatus() == RequestStatus.ACEITA) {
            applyAssociation(request);
            sendAcceptedNotification(request);
        }

        repo.save(request);
        return AssociationResponseDto.from(request);
    }

    public List<AssociationResponseDto> findAllByUser(String email) {
        User user = userRepo.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Set<AssociationRequest> requests = new HashSet<>();
        requests.addAll(repo.findByCreator(user));
        requests.addAll(repo.findByResponder(user));
        requests.addAll(repo.findByRelation(user));
        if (user instanceof Patient) {
            requests.addAll(repo.findByPatient(user));
        }
        if (user instanceof Caregiver) {
            requests.addAll(repo.findByCaregiver(user));
        }

        return requests.stream()
                .distinct()
                .map(AssociationResponseDto::from)
                .toList();
    }

    public AssociationResponseDto findByIdForUser(Long id, String email) {
        User user = userRepo.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AssociationRequest request = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!isUserRelated(request, user)) {
            throw new AccessDeniedException("User not authorized to view this request");
        }

        return AssociationResponseDto.from(request);
    }

    // --- métodos auxiliares: validateResponderPermission, applyAssociation, send notifications, isUserRelated ---
    private void validateResponderPermission(AssociationRequest request, User responder) {
        if (request.getCreator().equals(responder)) {
            throw new AccessDeniedException("O criador da solicitação não pode responder");
        }

        switch (request.getType()) {
            case PATIENT_TO_DOCTOR -> {
                if (!(responder instanceof Doctor))
                    throw new AccessDeniedException("Apenas um médico pode aceitar esta solicitação");
                if (!responder.getId().equals(request.getRelation().getId()))
                    throw new AccessDeniedException("Apenas o médico relacionado pode aceitar");
            }
            case PATIENT_TO_CAREGIVER -> {
                boolean isPatient = responder instanceof Patient
                        && responder.getId().equals(request.getPatient().getId());
                boolean isCaregiver = responder instanceof Caregiver && request.getPatient().getCaregivers().stream()
                        .anyMatch(c -> c.getId().equals(responder.getId()));
                if (!isPatient && !isCaregiver)
                    throw new AccessDeniedException(
                            "Apenas o paciente ou um cuidador relacionado podem aceitar esta solicitação");
            }
            case DOCTOR_TO_PATIENT, CAREGIVER_TO_PATIENT -> {
                boolean isPatient = responder instanceof Patient
                        && responder.getId().equals(request.getPatient().getId());
                boolean isCaregiver = responder instanceof Caregiver && request.getPatient().getCaregivers().stream()
                        .anyMatch(c -> c.getId().equals(responder.getId()));
                if (!isPatient && !isCaregiver)
                    throw new AccessDeniedException(
                            "Apenas o paciente ou seus cuidadores podem aceitar esta solicitação");
            }
            default -> throw new AccessDeniedException("Tipo de solicitação inválido para resposta");
        }
    }

    private boolean isUserRelated(AssociationRequest request, User user) {
        return request.getCreator().equals(user)
                || (request.getResponder() != null && request.getResponder().equals(user))
                || request.getPatient().equals(user)
                || request.getRelation().equals(user);
    }

    private void applyAssociation(AssociationRequest request) {
        Patient patient = request.getPatient();

        switch (request.getType()) {
            case PATIENT_TO_DOCTOR, DOCTOR_TO_PATIENT -> {
                Doctor doctor = doctorRepo.findByIdAndActiveTrue(request.getRelation().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
                patient.getDoctors().add(doctor);
                doctor.getPatients().add(patient);
                patientRepo.save(patient);
                doctorRepo.save(doctor);
            }
            case PATIENT_TO_CAREGIVER, CAREGIVER_TO_PATIENT -> {
                Caregiver caregiver = caregiverRepo.findByIdAndActiveTrue(request.getRelation().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"));
                patient.getCaregivers().add(caregiver);
                caregiver.getPatients().add(patient);
                patientRepo.save(patient);
                caregiverRepo.save(caregiver);
            }
        }
    }

    private void sendCreationNotification(AssociationRequest request) {
        String title = "Nova solicitação de associação";
        String message = String.format("%s enviou uma solicitação de associação para você.",
                request.getCreator().getName());

        NotificationCreateRequest notification = new NotificationCreateRequest(
                request.getCreator().getId(),
                NotificationType.RELATIONAL_UPDATE,
                title,
                message,
                List.of(request.getRelation().getId()),
                request.getId()
        );

        notificationService.createAndSend(notification);
    }

    private void sendAcceptedNotification(AssociationRequest request) {
        String title = "Solicitação de associação aceita";
        String message = String.format("%s aceitou a solicitação de associação.", request.getResponder().getName());

        NotificationCreateRequest notification = new NotificationCreateRequest(
                request.getResponder().getId(),
                NotificationType.RELATIONAL_UPDATE,
                title,
                message,
                List.of(request.getCreator().getId(), request.getPatient().getId()),
                request.getId()
        );

        notificationService.createAndSend(notification);
    }
}
