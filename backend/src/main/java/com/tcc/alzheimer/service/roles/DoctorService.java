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
                        .map(Patient::getEmail)
                        .collect(Collectors.toList()));
    }

    public DoctorService(DoctorRepository repo, PatientRepository patientRepo, PasswordEncoder encoder) {
        this.repo = repo;
        this.patientRepo = patientRepo;
        this.encoder = encoder;
    }

    public List<DoctorGetDto> findAll() {
        return repo.findAllByActiveTrue().stream()
                .map(this::toDto)
                .toList();
    }

    public DoctorGetDto findById(Long id) {
        Doctor doctor = repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medico com id " + id + " nao encontrado"));
        return toDto(doctor);
    }

    private Doctor findByIdIntern(Long id) {
        return repo.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medico com id " + id + " nao encontrado"));
    }

    public Doctor save(DoctorPostAndPutDto dto) {
        if (repo.findByCpf(dto.getCpf()).isPresent()) {
            throw new ResourceConflictException("CPF ja cadastrado!");
        }
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email ja cadastrado!");
        }
        if (repo.findByCrm(dto.getCrm()).isPresent()) {
            throw new ResourceConflictException("CRM ja cadastrado!");
        }

        Doctor doctor = new Doctor();
        doctor.setCpf(dto.getCpf());
        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setCrm(dto.getCrm());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setPassword(encoder.encode(dto.getPassword()));
        doctor.setType(dto.getUserType());
        doctor.setPatients(null);
        doctor.setActive(Boolean.TRUE);

        return repo.save(doctor);
    }

    @Transactional
    public Doctor update(Long id, Doctor doctor, List<String> patientEmails) {
        Doctor existing = findByIdIntern(id);

        existing.setName(doctor.getName());
        existing.setCpf(doctor.getCpf());
        existing.setEmail(doctor.getEmail());
        existing.setPhone(doctor.getPhone());
        existing.setCrm(doctor.getCrm());
        existing.setSpeciality(doctor.getSpeciality());

        if (patientEmails != null) {
            existing.getPatients().forEach(p -> p.getDoctors().remove(existing));
            existing.getPatients().clear();

            patientEmails.forEach(email -> {
                Patient patient = patientRepo.findByEmailAndActiveTrue(email)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Paciente com email " + email + " nao encontrado"));
                existing.getPatients().add(patient);
                patient.getDoctors().add(existing);
            });
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        Doctor doctor = findByIdIntern(id);
        doctor.setActive(Boolean.FALSE);
        repo.save(doctor);
    }

    public List<BasicDtoForList> searchUsersByDoc(Doctor doctor) {
        return doctor.getPatients().stream()
                .filter(patient -> Boolean.TRUE.equals(patient.getActive()))
                .map(patient -> new BasicDtoForList(
                        patient.getId(),
                        patient.getName(),
                        patient.getEmail(),
                        patient.getPhone(),
                        patient.getType()))
                .toList();
    }

    public List<BasicDtoForList> searchUsersByDoc(Long id, String query, String serviceType) {

        Doctor doctor = findByIdIntern(id);
        List<Patient> patients;

        if ((query == null || query.isBlank()) && (serviceType == null || serviceType.isBlank())) {
            patients = patientRepo.findByDoctorsAndActiveTrue(doctor); // already filtered by active
        } else {
            patients = patientRepo.findByDoctorWithFilters(doctor.getId(), query, serviceType);
        }

        return patients.stream()
                .filter(patient -> Boolean.TRUE.equals(patient.getActive()))
                .map(patient -> new BasicDtoForList(
                        patient.getId(),
                        patient.getName(),
                        patient.getEmail(),
                        patient.getPhone(),
                        patient.getType()))
                .toList();
    }
}


