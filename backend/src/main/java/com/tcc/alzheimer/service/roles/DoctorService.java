package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DoctorService {
    private final DoctorRepository repo;
    private final PatientRepository patientRepo;

    public DoctorService(DoctorRepository repo, PatientRepository patientRepo) {
        this.repo = repo;
        this.patientRepo = patientRepo;
    }

    public List<Doctor> findAll() {
        return repo.findAll();
    }

    public Doctor findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico com id " + id + " não encontrado"));
    }

    public Doctor save(Doctor doctor, List<String> patientEmails) {
        if (patientEmails != null) {
            patientEmails.forEach(email -> {
                Patient patient = patientRepo.findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Paciente com email " + email + " não encontrado"));
                doctor.getPatients().add(patient);
                patient.getDoctors().add(doctor);
            });
        }
        return repo.save(doctor);
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
                        .orElseThrow(() -> new ResourceNotFoundException("Paciente com email " + email + " não encontrado"));
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
