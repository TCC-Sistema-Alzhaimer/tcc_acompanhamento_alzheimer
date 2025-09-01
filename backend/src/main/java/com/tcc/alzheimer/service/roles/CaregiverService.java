package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;

@Service
public class CaregiverService {
private final CaregiverRepository repo;

    public CaregiverService(CaregiverRepository repo) {
        this.repo = repo;
    }

    public List<Caregiver> findAll() {
        return repo.findAll();
    }

    public Caregiver findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuidador com id " + id + " não encontrado"));
    }

    public Caregiver save(Caregiver caregiver) {
        return repo.save(caregiver);
    }

    public Caregiver update(Long id, Caregiver caregiver) {
        Caregiver existing = findById(id);
        existing.setName(caregiver.getName());
        existing.setCpf(caregiver.getCpf());
        existing.setEmail(caregiver.getEmail());
        existing.setPhone(caregiver.getPhone());
        existing.setBirthdate(caregiver.getBirthdate());
        existing.setGender(caregiver.getGender());
        existing.setAddress(caregiver.getAddress());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Caregiver caregiver = findById(id);
        repo.delete(caregiver);
    }
}
