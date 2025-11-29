package com.tcc.alzheimer.service.roles;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.dto.roles.doctor.DoctorGetDto;
import com.tcc.alzheimer.dto.roles.doctor.DoctorPostAndPutDto;
import com.tcc.alzheimer.exception.BadRequestException;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.repository.roles.UserRepository;

@Service
public class DoctorService {
    private final DoctorRepository repo;
    private final PatientRepository patientRepo;
    private final UserRepository UserRepo;
    private final PasswordEncoder encoder;

    public DoctorService(DoctorRepository repo, PatientRepository patientRepo, PasswordEncoder encoder, UserRepository UserRepo) {
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

    private DoctorGetDto toDto(Doctor doctor) {
        return new DoctorGetDto(
                doctor.getCpf(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getPhone(),
                doctor.getCrm(),
                doctor.getSpeciality(),
                doctor.getPatients().stream()
                        .filter(patient -> Boolean.TRUE.equals(patient.getActive()))
                        .map(p -> p.getEmail())
                        .collect(Collectors.toList()));
    }

    public List<DoctorGetDto> findAll() {
        return repo.findAllByActiveTrue().stream()
                .map(this::toDto)
                .toList();
    }

    public DoctorGetDto findById(Long id) {
        Doctor doctor = findByIdIntern(id);
        return toDto(doctor);
    }

    private Doctor findByIdIntern(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico com id " + id + " não encontrado"));
    }

    public Doctor save(DoctorPostAndPutDto dto) {

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

        if (repo.findByCrm(dto.getCrm()).isPresent())
            throw new ResourceConflictException("CRM já cadastrado!");
        

        validatePasswordLength(dto.getPassword());

        Doctor doctor = new Doctor();
        doctor.setCpf(cleanedCpf);
        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(cleanedPhone);
        doctor.setCrm(dto.getCrm());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setPassword(encoder.encode(dto.getPassword()));
        doctor.setType(dto.getUserType());
        doctor.setActive(Boolean.TRUE);

        return repo.save(doctor);
    }

    @Transactional
    public DoctorGetDto update(Long id, DoctorPostAndPutDto dto) {
        Doctor existing = findByIdIntern(id);

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
        existing.setName(dto.getName());
        existing.setCpf(cleanedCpf);
        existing.setEmail(dto.getEmail());
        existing.setPhone(cleanedPhone);
        existing.setCrm(dto.getCrm());
        existing.setSpeciality(dto.getSpeciality());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            validatePasswordLength(dto.getPassword());
            existing.setPassword(encoder.encode(dto.getPassword()));
        }

        repo.save(existing);
        return toDto(existing);
}

    public void delete(Long id) {
        Doctor doctor = findByIdIntern(id);
        doctor.setActive(Boolean.FALSE);
        repo.save(doctor);
    }

    public List<BasicDtoForList> searchUsersByDoc(Long id, String query, String serviceType) {
        var doctor = findByIdIntern(id);
        List<Patient> patients;

        if (query == null || query.trim().isEmpty()) {
            patients = patientRepo.findByDoctorsAndActiveTrue(doctor);
        } else {
            patients = patientRepo.findByDoctorsAndActiveTrueAndNameContainingIgnoreCase(doctor, query);
        }

        return patients.stream()
                .map(p -> new BasicDtoForList(p.getId(), p.getName(), p.getEmail(), p.getPhone(), p.getType()))
                .toList();
    }
}
