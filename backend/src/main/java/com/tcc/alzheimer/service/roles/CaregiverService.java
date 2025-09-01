package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CaregiverService {
    private final CaregiverRepository repo;
    private final PatientRepository patientRepo;

    public CaregiverService(CaregiverRepository repo, PatientRepository patientRepo) {
        this.repo = repo;
        this.patientRepo = patientRepo;
    }

    public List<Caregiver> findAll() {
        return repo.findAll();
    }

    public Caregiver findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuidador com id " + id + " não encontrado"));
    }

    public Caregiver save(Caregiver caregiver, List<String> patientEmails) {
        if (patientEmails == null || patientEmails.isEmpty()) {
            throw new IllegalArgumentException("Cuidador precisa ter pelo menos 1 paciente.");
        }

        patientEmails.forEach(email -> {
            Patient patient = patientRepo.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Paciente com email " + email + " não encontrado"));
            caregiver.getPatients().add(patient);
            patient.getCaregivers().add(caregiver);
        });

        return repo.save(caregiver);
    }

    @Transactional
    public Caregiver update(Long id, Caregiver caregiver, List<String> patientEmails) {
        Caregiver existing = findById(id);

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
                Patient patient = patientRepo.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Paciente com email " + email + " não encontrado"));
                existing.getPatients().add(patient);
                patient.getCaregivers().add(existing);
            });
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        Caregiver caregiver = findById(id);
        repo.delete(caregiver);
    }

    public List<Patient> getPatients(Caregiver caregiver) {
        return new ArrayList<>(caregiver.getPatients());
    }
}
