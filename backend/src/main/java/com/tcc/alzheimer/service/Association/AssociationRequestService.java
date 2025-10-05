package com.tcc.alzheimer.service.Association;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.dto.Association.AssociationRequestCreateDto;
import com.tcc.alzheimer.dto.Association.AssociationRequestRespondDto;
import com.tcc.alzheimer.dto.Association.AssociationRequestResponseDto;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.Association.AssociationRequest;
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

import jakarta.transaction.Transactional;

@Service
public class AssociationRequestService {

    private final AssociationRequestRepository repo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final CaregiverRepository caregiverRepo;

    public AssociationRequestService(
            AssociationRequestRepository repo,
            UserRepository userRepo,
            PatientRepository patientRepo,
            DoctorRepository doctorRepo,
            CaregiverRepository caregiverRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
        this.caregiverRepo = caregiverRepo;
    }

    public AssociationRequestResponseDto create(AssociationRequestCreateDto dto) {
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
        return toDto(request);
    }

    @Transactional
    public AssociationRequestResponseDto respond(Long id, AssociationRequestRespondDto dto) {
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
        }

        repo.save(request);
        return toDto(request);
    }

    public List<AssociationRequestResponseDto> findAllByUser(String email) {
        User user = userRepo.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return repo.findAllVisibleToUser(user)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public AssociationRequestResponseDto findByIdForUser(Long id, String email) {
        User user = userRepo.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AssociationRequest request = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!isUserRelated(request, user)) {
            throw new AccessDeniedException("User not authorized to view this request");
        }

        return toDto(request);
    }

    private void validateResponderPermission(AssociationRequest request, User responder) {
        switch (request.getType()) {
            case PATIENT_TO_DOCTOR, CAREGIVER_TO_PATIENT -> {
                if (!request.getRelation().equals(responder)) {
                    throw new AccessDeniedException("Only the relation user can respond");
                }
            }
            case DOCTOR_TO_PATIENT, PATIENT_TO_CAREGIVER -> {
                if (!request.getPatient().equals(responder)) {
                    throw new AccessDeniedException("Only the patient can respond");
                }
            }
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

    private AssociationRequestResponseDto toDto(AssociationRequest r) {
        AssociationRequestResponseDto dto = new AssociationRequestResponseDto();
        dto.setId(r.getId());
        dto.setPatientEmail(r.getPatient().getEmail());
        dto.setRelationEmail(r.getRelation().getEmail());
        dto.setType(r.getType());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setRespondedAt(r.getRespondedAt());
        dto.setCreatorEmail(r.getCreator().getEmail());
        dto.setResponderEmail(r.getResponder() != null ? r.getResponder().getEmail() : null);
        return dto;
    }
}
