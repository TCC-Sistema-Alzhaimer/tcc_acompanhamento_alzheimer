package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.carregiver.CaregiverPostAndPutDto;
import com.tcc.alzheimer.dto.roles.carregiver.CarregiverGetDto;
import com.tcc.alzheimer.dto.roles.patient.PatientResponseGetDTO;
import com.tcc.alzheimer.exception.BadRequestException;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;

@Service
public class CaregiverService {
    private final CaregiverRepository repo;
    private final PatientRepository patientRepo;
    private final UserRepository UserRepo;
    private final PasswordEncoder encoder;

    public CaregiverService(CaregiverRepository repo, PatientRepository patientRepo, PasswordEncoder encoder, UserRepository UserRepo) {
        this.repo = repo;
        this.patientRepo = patientRepo;
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
    
    private String normalizeAndValidateGender(String gender) {
        if (gender == null || gender.isBlank()) {
            throw new BadRequestException("O gênero é obrigatório.");
        }
        String upperCaseGender = gender.trim().toUpperCase();
        
        if (upperCaseGender.startsWith("M")) {
            return "M";
        }
        if (upperCaseGender.startsWith("F")) {
            return "F";
        }
        throw new BadRequestException("Gênero inválido. Use M, F, MASCULINO ou FEMININO.");
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

    private PatientResponseGetDTO toPatientDto(Patient patient) {
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
                        .map(doctor -> doctor.getEmail())
                        .toList(),
                patient.getCaregivers().stream()
                        .filter(caregiver -> Boolean.TRUE.equals(caregiver.getActive()))
                        .map(caregiver -> caregiver.getEmail())
                        .toList());
    }

    public List<CarregiverGetDto> findAll() {
        return repo.findAllByActiveTrue().stream()
                .map(this::toDto)
                .toList();
    }

    public CarregiverGetDto findById(Long id) {
        Caregiver caregiver = findByIdIntern(id);
        return toDto(caregiver);
    }

    public Caregiver findByIdIntern(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuidador com id " + id + " nao encontrado"));
    }

    public Caregiver save(CaregiverPostAndPutDto dto) {

        if (dto.getCpf() == null || dto.getCpf().isBlank()) {
            throw new BadRequestException("CPF é obrigatório.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BadRequestException("Email é obrigatório.");
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new BadRequestException("Nome é obrigatório.");
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new BadRequestException("Senha é obrigatória.");
        }

        String cleanedCpf = cleanNumericField(dto.getCpf());
        if(cleanedCpf.length() != 11) {
            throw new BadRequestException("CPF inválido. Deve conter 11 dígitos.");
        }

        String cleanedPhone = cleanNumericField(dto.getPhone());
        if(cleanedPhone.length() < 10 || cleanedPhone.length() > 11) {
            throw new BadRequestException("Telefone inválido. Deve conter entre 10 e 11 dígitos.");
        }

        if (UserRepo.findByCpf(cleanedCpf).isPresent())
            throw new ResourceConflictException("CPF já cadastrado!");

        if (UserRepo.findByEmail(dto.getEmail()).isPresent())
            throw new ResourceConflictException("Email já cadastrado!");


        String normalizedGender = normalizeAndValidateGender(dto.getGender());
        validatePasswordLength(dto.getPassword());

        Caregiver caregiver = new Caregiver();
        caregiver.setCpf(cleanedCpf);
        caregiver.setName(dto.getName());
        caregiver.setEmail(dto.getEmail());
        caregiver.setPhone(cleanedPhone);
        caregiver.setBirthdate(dto.getBirthdate());
        caregiver.setGender(normalizedGender);
        caregiver.setAddress(dto.getAddress());
        caregiver.setPassword(encoder.encode(dto.getPassword()));
        caregiver.setType(dto.getUserType());
        caregiver.setActive(Boolean.TRUE);

        return repo.save(caregiver);
    }

    @Transactional
    public CarregiverGetDto update(Long id, CaregiverPostAndPutDto dto) {
        Caregiver existing = findByIdIntern(id);
        
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new BadRequestException("Nome é obrigatório para atualização.");
        }
        if (dto.getCpf() == null || dto.getCpf().isBlank()) {
            throw new BadRequestException("CPF é obrigatório para atualização.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BadRequestException("Email é obrigatório para atualização.");
        }

        String cleanedCpf = cleanNumericField(dto.getCpf());
        if(cleanedCpf.length() != 11) {
            throw new BadRequestException("CPF inválido. Deve conter 11 dígitos.");
        }

        String cleanedPhone = cleanNumericField(dto.getPhone());
        if(cleanedPhone.length() < 10 || cleanedPhone.length() > 11) {
            throw new BadRequestException("Telefone inválido. Deve conter entre 10 e 11 dígitos.");
        }
        String normalizedGender = normalizeAndValidateGender(dto.getGender());

        existing.setName(dto.getName());
        existing.setCpf(cleanedCpf);
        existing.setEmail(dto.getEmail());
        existing.setPhone(cleanedPhone);
        existing.setBirthdate(dto.getBirthdate());
        existing.setGender(normalizedGender);
        existing.setAddress(dto.getAddress());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            validatePasswordLength(dto.getPassword());
            existing.setPassword(encoder.encode(dto.getPassword()));
        }

        repo.save(existing);
        return toDto(existing);
    }

    public void delete(Long id) {
        Caregiver caregiver = findByIdIntern(id);
        caregiver.setActive(Boolean.FALSE);
        repo.save(caregiver);
    }

    @Transactional(readOnly = true)
    public List<PatientResponseGetDTO> getPatients(Long id) {
        Caregiver caregiver = findByIdIntern(id);
        return patientRepo.findByCaregiversAndActiveTrue(caregiver).stream()
                .map(this::toPatientDto)
                .toList();
    }
}
