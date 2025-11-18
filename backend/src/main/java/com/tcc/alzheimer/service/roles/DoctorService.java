package com.tcc.alzheimer.service.roles;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.dto.roles.doctor.DoctorGetDto;
import com.tcc.alzheimer.dto.roles.doctor.DoctorPostAndPutDto;
import com.tcc.alzheimer.exception.ResourceConflictException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;

@Service
public class DoctorService {
    private final DoctorRepository repo;
    private final PatientRepository patientRepo;
    private final PasswordEncoder encoder;

    public DoctorService(DoctorRepository repo, PatientRepository patientRepo, PasswordEncoder encoder) {
        this.repo = repo;
        this.patientRepo = patientRepo;
        this.encoder = encoder;
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
        if (repo.findByCpf(dto.getCpf()).isPresent())
            throw new ResourceConflictException("CPF já cadastrado!");

        if (repo.findByEmail(dto.getEmail()).isPresent())
            throw new ResourceConflictException("Email já cadastrado!");

        if (repo.findByCrm(dto.getCrm()).isPresent())
            throw new ResourceConflictException("CRM já cadastrado!");

        Doctor doctor = new Doctor();
        doctor.setCpf(dto.getCpf());
        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
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

    existing.setName(dto.getName());
    existing.setCpf(dto.getCpf());
    existing.setEmail(dto.getEmail());
    existing.setPhone(dto.getPhone());
    existing.setCrm(dto.getCrm());
    existing.setSpeciality(dto.getSpeciality());
    if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
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
