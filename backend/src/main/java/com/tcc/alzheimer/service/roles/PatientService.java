package com.tcc.alzheimer.service.roles;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.patient.PatientPostAndUpdateDto;
import com.tcc.alzheimer.dto.roles.patient.PatientResponseGetDTO;
import com.tcc.alzheimer.exception.BadRequestException;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;

@Service
public class PatientService {
    private final PatientRepository repo;
    private final DoctorRepository doctorRepo;
    private final CaregiverRepository caregiverRepo;
    private final UserRepository UserRepo;
    private final PasswordEncoder encoder;

    public PatientService(PatientRepository repo, DoctorRepository doctorRepo, CaregiverRepository caregiverRepo,
            PasswordEncoder encoder, UserRepository UserRepo) {
        this.repo = repo;
        this.doctorRepo = doctorRepo;
        this.caregiverRepo = caregiverRepo;
        this.encoder = encoder;
        this.UserRepo = UserRepo;
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

        if (UserRepo.findByCpf(cleanedCpf).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (UserRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }
        validatePasswordLength(dto.getPassword());

        String normalizedGender = normalizeAndValidateGender(dto.getGender());

        Patient patient = new Patient();
        patient.setCpf(cleanedCpf);
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(cleanedPhone);
        patient.setBirthdate(dto.getBirthdate());
        patient.setGender(normalizedGender);
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
        existing.setEmail(dto.getEmail());
        existing.setCpf(cleanedCpf);
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
