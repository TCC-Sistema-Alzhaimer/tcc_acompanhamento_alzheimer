package com.tcc.alzheimer.service.roles;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.ValidationUtils;

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
        Patient existing = findByIdIntern(id);

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setBirthdate(dto.getBirthdate());
        existing.setGender(dto.getGender());
        existing.setAddress(dto.getAddress());

        // ✅ Atualiza senha somente se enviada
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(encoder.encode(dto.getPassword()));
        }

        repo.save(existing);

        return toDto(existing);
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
