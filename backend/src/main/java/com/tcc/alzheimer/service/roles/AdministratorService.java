package com.tcc.alzheimer.service.roles;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.BadRequestException;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.Administrator;
import com.tcc.alzheimer.repository.roles.AdministratorRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;

@Service
public class AdministratorService {
    private final AdministratorRepository repo;
    private final UserRepository UserRepo;
    private final PasswordEncoder encoder;

    public AdministratorService(AdministratorRepository repo, PasswordEncoder encoder, UserRepository UserRepo) {
        this.repo = repo;
        this.encoder = encoder;
        this.UserRepo = UserRepo;
    }

    private void validatePasswordLength(String password) {
        if (password == null || password.trim().length() < 6) {
            throw new BadRequestException("A senha deve ter no mínimo 6 caracteres.");
        }
    }

    private String cleanNumericField(String value) {
        if (value == null) return null;
        return value.replaceAll("[^0-9]", "");
    }

    public List<Administrator> findAll() {
        return repo.findAllByActiveTrue();
    }

    public Administrator findById(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador com id " + id + " nao encontrado"));
    }

    public Administrator register(Administrator administrator) {

        if (administrator.getCpf() == null || administrator.getCpf().isBlank()) {
            throw new BadRequestException("CPF é obrigatório.");
        }
        if (administrator.getEmail() == null || administrator.getEmail().isBlank()) {
            throw new BadRequestException("Email é obrigatório.");
        }
        if (administrator.getName() == null || administrator.getName().isBlank()) {
            throw new BadRequestException("Nome é obrigatório.");
        }
        if (administrator.getPassword() == null || administrator.getPassword().isBlank()) {
            throw new BadRequestException("Senha é obrigatória.");
        }

        String cleanedCpf = cleanNumericField(administrator.getCpf());
        if(cleanedCpf.length() != 11) {
            throw new BadRequestException("CPF inválido. Deve conter 11 dígitos.");
        }

        String cleanedPhone = cleanNumericField(administrator.getPhone());
        if(cleanedPhone.length() < 10 || cleanedPhone.length() > 11) {
            throw new BadRequestException("Telefone inválido. Deve conter entre 10 e 11 dígitos.");
        }

        if (UserRepo.findByCpf(cleanedCpf).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (UserRepo.findByEmail(administrator.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }

        validatePasswordLength(administrator.getPassword());

        Administrator admin = new Administrator();
        admin.setCpf(cleanedCpf);
        admin.setName(administrator.getName());
        admin.setEmail(administrator.getEmail());
        admin.setPhone(cleanedPhone);
        admin.setPassword(encoder.encode(administrator.getPassword()));
        admin.setType(UserType.ADMINISTRATOR);

        admin.setActive(Boolean.TRUE);
        return repo.save(admin);
    }

    public Administrator update(Long id, Administrator administrator) {

        Administrator existing = findById(id);

        if (administrator.getName() == null || administrator.getName().isBlank()) {
            throw new BadRequestException("Nome é obrigatório para atualização.");
        }
        if (administrator.getCpf() == null || administrator.getCpf().isBlank()) {
            throw new BadRequestException("CPF é obrigatório para atualização.");
        }
        if (administrator.getEmail() == null || administrator.getEmail().isBlank()) {
            throw new BadRequestException("Email é obrigatório para atualização.");
        }

        String cleanedCpf = cleanNumericField(administrator.getCpf());
        if(cleanedCpf.length() != 11) {
            throw new BadRequestException("CPF inválido. Deve conter 11 dígitos.");
        }

        String cleanedPhone = cleanNumericField(administrator.getPhone());
        if(cleanedPhone.length() < 10 || cleanedPhone.length() > 11) {
            throw new BadRequestException("Telefone inválido. Deve conter entre 10 e 11 dígitos.");
        }

        existing.setName(administrator.getName());
        existing.setCpf(cleanedCpf);
        existing.setEmail(administrator.getEmail());
        existing.setPhone(cleanedPhone);
        return repo.save(existing);
    }

    public void delete(Long id) {
        Administrator administrator = findById(id);
        administrator.setActive(Boolean.FALSE);
        repo.save(administrator);
    }
}

