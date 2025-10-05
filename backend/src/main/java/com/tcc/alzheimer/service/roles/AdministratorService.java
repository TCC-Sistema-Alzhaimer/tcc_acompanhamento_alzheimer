package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.Administrator;
import com.tcc.alzheimer.repository.roles.AdministratorRepository;

@Service
public class AdministratorService {
    private final AdministratorRepository repo;
    private final PasswordEncoder encoder;

    public AdministratorService(AdministratorRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public List<Administrator> findAll() {
        return repo.findAllByActiveTrue();
    }

    public Administrator findById(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador com id " + id + " nao encontrado"));
    }

    public Administrator save(Administrator administrator) {
        if (administrator.getActive() == null) {
            administrator.setActive(Boolean.TRUE);
        }
        return repo.save(administrator);
    }

    public Administrator register(Administrator administrator) {
        if (repo.findByCpf(administrator.getCpf()).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (repo.findByEmail(administrator.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }

        Administrator admin = new Administrator();
        admin.setCpf(administrator.getCpf());
        admin.setName(administrator.getName());
        admin.setEmail(administrator.getEmail());
        admin.setPhone(administrator.getPhone());
        admin.setPassword(encoder.encode(administrator.getPassword()));
        admin.setType(UserType.ADMINISTRATOR);

        admin.setActive(Boolean.TRUE);
        return repo.save(admin);
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
        administrator.setActive(Boolean.FALSE);
        repo.save(administrator);
    }
}

