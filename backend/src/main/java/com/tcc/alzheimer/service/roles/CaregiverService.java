package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.carregiver.CaregiverPostAndPutDto;
import com.tcc.alzheimer.dto.roles.carregiver.CarregiverGetDto;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;

@Service
public class CaregiverService {
    private final CaregiverRepository repo;
    private final PatientRepository patientRepo;
    private final PasswordEncoder encoder;

    public CaregiverService(CaregiverRepository repo, PatientRepository patientRepo, PasswordEncoder encoder) {
        this.repo = repo;
        this.patientRepo = patientRepo;
        this.encoder = encoder;
    }

    private CarregiverGetDto toDto(Caregiver caregiver) {
        List<String> patientEmails = new ArrayList<>();
        if (caregiver.getPatients() != null) {
            caregiver.getPatients().stream()
                    .filter(patient -> Boolean.TRUE.equals(patient.getActive()))
                    .forEach(p -> patientEmails.add(p.getEmail()));
        }
        return new CarregiverGetDto(
                caregiver.getCpf(),
                caregiver.getName(),
                caregiver.getEmail(),
                caregiver.getPhone(),
                caregiver.getBirthdate(),
                caregiver.getGender(),
                caregiver.getAddress(),
                patientEmails);
    }

    public List<CarregiverGetDto> findAll() {
        return repo.findAllByActiveTrue().stream()
                .map(this::toDto)
                .toList();
    }

    public CarregiverGetDto findById(Long id) {
        Caregiver caregiver = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuidador com id " + id + " nao encontrado"));
        return toDto(caregiver);
    }

    public Caregiver findByIdIntern(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuidador com id " + id + " nao encontrado"));
    }

    public Caregiver save(CaregiverPostAndPutDto dto) {
        if (repo.findByCpf(dto.getCpf()).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }

        Caregiver caregiver = new Caregiver();
        caregiver.setCpf(dto.getCpf());
        caregiver.setName(dto.getName());
        caregiver.setEmail(dto.getEmail());
        caregiver.setPhone(dto.getPhone());
        caregiver.setBirthdate(dto.getBirthdate());
        caregiver.setGender(dto.getGender());
        caregiver.setAddress(dto.getAddress());
        caregiver.setPassword(encoder.encode(dto.getPassword()));
        caregiver.setType(dto.getUserType());
        caregiver.setPatients(null);
        caregiver.setActive(Boolean.TRUE);

        return repo.save(caregiver);
    }

    @Transactional
    public Caregiver update(Long id, Caregiver caregiver, List<String> patientEmails) {
        Caregiver existing = findByIdIntern(id);

        existing.setName(caregiver.getName());
        existing.setCpf(caregiver.getCpf());
        existing.setEmail(caregiver.getEmail());
        existing.setPhone(caregiver.getPhone());
        existing.setBirthdate(caregiver.getBirthdate());
        existing.setGender(caregiver.getGender());
        existing.setAddress(caregiver.getAddress());

        if (patientEmails != null) {
            existing.getPatients().forEach(p -> p.getCaregivers().remove(existing));
            existing.getPatients().clear();

            patientEmails.forEach(email -> {
                Patient patient = patientRepo.findByEmailAndActiveTrue(email)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Paciente com email " + email + " nao encontrado"));
                existing.getPatients().add(patient);
                patient.getCaregivers().add(existing);
            });
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        Caregiver caregiver = findByIdIntern(id);
        caregiver.setActive(Boolean.FALSE);
        repo.save(caregiver);
    }

    public List<Patient> getPatients(Long id) {
        Caregiver caregiver = findByIdIntern(id);
        return caregiver.getPatients().stream()
                .filter(patient -> Boolean.TRUE.equals(patient.getActive()))
                .toList();
    }
}

