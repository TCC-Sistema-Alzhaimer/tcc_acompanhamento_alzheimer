package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Administrator;
import com.tcc.alzheimer.repository.roles.AdministratorRepository;

@Service
public class AdministratorService {
    private final AdministratorRepository repo;

    public AdministratorService(AdministratorRepository repo) {
        this.repo = repo;
    }

    public List<Administrator> findAll() {
        return repo.findAll();
    }

    public Administrator findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adm com id " + id + " não encontrado"));
    }

    public Administrator save(Administrator administrator) {
        return repo.save(administrator);
    }

    public Administrator update(Long id, Administrator administrator) {
        Administrator existing = findById(id);
        existing.setName(administrator.getName());
        existing.setCpf(administrator.getCpf());
        existing.setEmail(administrator.getEmail());
        existing.setPhone(administrator.getPhone());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Administrator administrator = findById(id);
        repo.delete(administrator);
    }
}
