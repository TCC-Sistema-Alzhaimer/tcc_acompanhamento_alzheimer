package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.DoctorDto;
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

    public List<Doctor> findAll() {
        return repo.findAll();
    }

    public Doctor findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico com id " + id + " não encontrado"));
    }

    public Doctor save(DoctorDto dto) {
        if ((repo.findByEmail(dto.getEmail()).isEmpty()) || (repo.findByCpf(dto.getCpf()).isEmpty())
                || (repo.findByCrm(dto.getCrm()).isEmpty())) {
            Doctor doctor = new Doctor();
            doctor.setCpf(dto.getCpf());
            doctor.setName(dto.getName());
            doctor.setEmail(dto.getEmail());
            doctor.setPhone(dto.getPhone());
            doctor.setCrm(dto.getCrm());
            doctor.setSpeciality(dto.getSpeciality());
            doctor.setPassword(encoder.encode(dto.getPassword()));
            doctor.setType(dto.getUserType());
            List<String> patientEmails = dto.getPatientEmails();

            if (patientEmails != null) {
                patientEmails.forEach(email -> {
                    Patient patient = patientRepo.findByEmail(email)
                            .orElseThrow(
                                    () -> new ResourceNotFoundException(
                                            "Paciente com email " + email + " não encontrado"));
                    doctor.getPatients().add(patient);
                    patient.getDoctors().add(doctor);
                });
            }
            return repo.save(doctor);
        } else {
            throw new IllegalArgumentException("Médico já existe. Não será recriado.");
        }
    }

    @Transactional
    public Doctor update(Long id, Doctor doctor, List<String> patientEmails) {
        Doctor existing = findById(id);

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
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Paciente com email " + email + " não encontrado"));
                existing.getPatients().add(patient);
                patient.getDoctors().add(existing);
            });
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        Doctor doctor = findById(id);
        repo.delete(doctor);
    }

    public List<Patient> getPatients(Doctor doctor) {
        return new ArrayList<>(doctor.getPatients());
    }
}
