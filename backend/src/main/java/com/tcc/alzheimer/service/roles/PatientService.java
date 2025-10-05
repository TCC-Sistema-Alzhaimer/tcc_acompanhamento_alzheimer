package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.patient.PatientPostAndUpdateDto;
import com.tcc.alzheimer.dto.roles.patient.PatientResponseGetDTO;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;

@Service
public class PatientService {
    private final PatientRepository repo;
    private final DoctorRepository doctorRepo;
    private final CaregiverRepository caregiverRepo;
    private final PasswordEncoder encoder;

    public PatientService(PatientRepository repo, DoctorRepository doctorRepo, CaregiverRepository caregiverRepo,
            PasswordEncoder encoder) {
        this.repo = repo;
        this.doctorRepo = doctorRepo;
        this.caregiverRepo = caregiverRepo;
        this.encoder = encoder;
    }

    private PatientResponseGetDTO toDto(Patient patient) {
        return new PatientResponseGetDTO(
                patient.getId(),
                patient.getName(),
                patient.getCpf(),
                patient.getEmail(),
                patient.getPhone(),
                patient.getGender(),
                patient.getAddress(),
                patient.getBirthdate(),
                patient.getDoctors().stream()
                        .filter(doctor -> Boolean.TRUE.equals(doctor.getActive()))
                        .map(Doctor::getEmail)
                        .collect(Collectors.toList()),
                patient.getCaregivers().stream()
                        .filter(caregiver -> Boolean.TRUE.equals(caregiver.getActive()))
                        .map(Caregiver::getEmail)
                        .collect(Collectors.toList()));
    }

    public List<PatientResponseGetDTO> findAll() {
        return repo.findAllByActiveTrue().stream()
                .map(this::toDto)
                .toList();
    }

    public PatientResponseGetDTO findById(Long id) {
        Patient patient = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente com id " + id + " nao encontrado"));
        return toDto(patient);
    }

    private Patient findByIdIntern(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente com id " + id + " nao encontrado"));
    }

    public Patient save(PatientPostAndUpdateDto dto) {
        if (repo.findByCpf(dto.getCpf()).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }

        Patient patient = new Patient();
        patient.setCpf(dto.getCpf());
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setBirthdate(dto.getBirthdate());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setPassword(encoder.encode(dto.getPassword()));
        patient.setType(dto.getUserType());
        patient.setDoctors(null);
        patient.setCaregivers(null);
        patient.setActive(Boolean.TRUE);

        return repo.save(patient);
    }

    @Transactional
    public PatientResponseGetDTO update(Long id, PatientPostAndUpdateDto dto) {
        Patient patient = findByIdIntern(id);

        patient.setName(dto.getName());
        patient.setCpf(dto.getCpf());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setBirthdate(dto.getBirthdate());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setPassword(dto.getPassword());

        if (dto.getDoctorEmails() != null) {
            patient.getDoctors().forEach(d -> d.getPatients().remove(patient));
            patient.getDoctors().clear();
            for (String email : dto.getDoctorEmails()) {
                Doctor doctor = doctorRepo.findByEmailAndActiveTrue(email)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Medico com email " + email + " nao encontrado"));
                patient.getDoctors().add(doctor);
                doctor.getPatients().add(patient);
            }
        }

        if (dto.getCaregiverEmails() != null) {
            patient.getCaregivers().forEach(c -> c.getPatients().remove(patient));
            patient.getCaregivers().clear();
            for (String email : dto.getCaregiverEmails()) {
                Caregiver caregiver = caregiverRepo.findByEmailAndActiveTrue(email)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Cuidador com email " + email + " nao encontrado"));
                patient.getCaregivers().add(caregiver);
                caregiver.getPatients().add(patient);
            }
        }

        Patient saved = repo.save(patient);

        PatientResponseGetDTO response = new PatientResponseGetDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setCpf(saved.getCpf());
        response.setEmail(saved.getEmail());
        response.setPhone(saved.getPhone());
        response.setBirthdate(saved.getBirthdate());
        response.setGender(saved.getGender());
        response.setAddress(saved.getAddress());
        response.setDoctorEmails(saved.getDoctors().stream()
                .filter(doctor -> Boolean.TRUE.equals(doctor.getActive()))
                .map(Doctor::getEmail)
                .collect(Collectors.toList()));
        response.setCaregiverEmails(
                saved.getCaregivers().stream()
                        .filter(caregiver -> Boolean.TRUE.equals(caregiver.getActive()))
                        .map(Caregiver::getEmail)
                        .collect(Collectors.toList()));

        return response;
    }

    public void delete(Long id) {
        Patient patient = findByIdIntern(id);
        patient.setActive(Boolean.FALSE);
        repo.save(patient);
    }

    public List<Caregiver> getCaregivers(Long id) {
        Patient patient = findByIdIntern(id);
        return patient.getCaregivers().stream()
                .filter(caregiver -> Boolean.TRUE.equals(caregiver.getActive()))
                .toList();
    }

    public List<Doctor> getDoctors(long id) {
        Patient patient = findByIdIntern(id);
        return patient.getDoctors().stream()
                .filter(doctor -> Boolean.TRUE.equals(doctor.getActive()))
                .toList();
    }
}

