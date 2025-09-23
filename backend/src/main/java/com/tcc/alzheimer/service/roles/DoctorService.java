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
                        .map(Patient::getEmail)
                        .collect(Collectors.toList()));
    }

    public DoctorService(DoctorRepository repo, PatientRepository patientRepo, PasswordEncoder encoder) {
        this.repo = repo;
        this.patientRepo = patientRepo;
        this.encoder = encoder;
    }

    public List<DoctorGetDto> findAll() {
        return repo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public DoctorGetDto findById(Long id) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico com id " + id + " não encontrado"));
        return toDto(doctor);
    }

    private Doctor findByIdIntern(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico com id " + id + " não encontrado"));
    }

    public Doctor save(DoctorPostAndPutDto dto) {
        // Verificar duplicidade antes de criar
        if (repo.findByCpf(dto.getCpf()).isPresent()) {
            throw new ResourceConflictException("CPF já cadastrado!");
        }
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email já cadastrado!");
        }
        if (repo.findByCrm(dto.getCrm()).isPresent()) {
            throw new ResourceConflictException("CRM já cadastrado!");
        }

        // Criar novo médico
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

        // No momento da criacao nao vai existir pacientes associados
        /*
         * List<String> patientEmails = dto.getPatientEmails();
         * if (patientEmails != null) {
         * patientEmails.forEach(email -> {
         * Patient patient = patientRepo.findByEmail(email)
         * .orElseThrow(() -> new ResourceNotFoundException(
         * "Paciente com email " + email + " não encontrado"));
         * doctor.getPatients().add(patient);
         * patient.getDoctors().add(doctor);
         * });
         * }
         */

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
                Patient patient = patientRepo.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Paciente com email " + email + " não encontrado"));
                existing.getPatients().add(patient);
                patient.getDoctors().add(existing);
            });
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        Doctor doctor = findByIdIntern(id);
        repo.delete(doctor);
    }

    public List<BasicDtoForList> searchUsersByDoc(Doctor doctor) {
        return doctor.getPatients().stream()
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
            patients = patientRepo.findByDoctors(doctor);
        } else {
            patients = patientRepo.findByDoctorWithFilters(doctor.getId(), query, serviceType);
        }

        return patients.stream()
                .map(patient -> new BasicDtoForList(
                        patient.getId(),
                        patient.getName(),
                        patient.getEmail(),
                        patient.getPhone(),
                        patient.getType()))
                .toList();
    }
}
