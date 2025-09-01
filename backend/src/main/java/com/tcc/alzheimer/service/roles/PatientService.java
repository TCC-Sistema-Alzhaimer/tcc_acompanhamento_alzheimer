package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.PatientRepository;

@Service
public class PatientService {
    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public List<Patient> findAll() {
        return repo.findAll();
    }

    public Patient findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente com id " + id + " não encontrado"));
    }

    public Patient save(Patient patient) {
        return repo.save(patient);
    }

    public Patient update(Long id, Patient patient) {
        Patient existing = findById(id);
        existing.setName(patient.getName());
        existing.setCpf(patient.getCpf());
        existing.setEmail(patient.getEmail());
        existing.setPhone(patient.getPhone());
        existing.setBirthdate(patient.getBirthdate());
        existing.setGender(patient.getGender());
        existing.setAddress(patient.getAddress());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Patient patient = findById(id);
        repo.delete(patient);
    }
}
