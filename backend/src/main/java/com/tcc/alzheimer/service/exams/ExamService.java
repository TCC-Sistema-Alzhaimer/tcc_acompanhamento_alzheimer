package com.tcc.alzheimer.service.exams;

import com.tcc.alzheimer.dto.exams.ExamCreateDTO;
import com.tcc.alzheimer.dto.exams.ExamResponseDTO;
import com.tcc.alzheimer.model.enums.ExamStatusType;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.model.exams.ExamStatus;
import com.tcc.alzheimer.model.exams.ExamType;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.exams.ExamRepository;
import com.tcc.alzheimer.repository.exams.ExamStatusRepository;
import com.tcc.alzheimer.repository.exams.ExamTypeRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ExamTypeRepository examTypeRepository;
    private final ExamStatusRepository examStatusRepository;

    public ExamService(ExamRepository examRepository, DoctorRepository doctorRepository,
            PatientRepository patientRepository, ExamTypeRepository examTypeRepository,
            ExamStatusRepository examStatusRepository) {
        this.examRepository = examRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.examTypeRepository = examTypeRepository;
        this.examStatusRepository = examStatusRepository;
    }

    @Transactional
    public Exam createExam(ExamCreateDTO dto) {
        Doctor doctor = doctorRepository.findByIdAndActiveTrue(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        Patient patient = patientRepository.findByIdAndActiveTrue(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        ExamType examType = examTypeRepository.findById(dto.getExamTypeId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Exam Type not found with id: " + dto.getExamTypeId()));

        ExamStatus examStatus = examStatusRepository.findById(ExamStatusType.REQUESTED.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Default exam status REQUESTED not found"));

        LocalDateTime scheduledDate = dto.getScheduledDate();

        Exam exam = new Exam();
        exam.setDoctor(doctor);
        exam.setPatient(patient);
        exam.setType(examType);
        exam.setStatus(examStatus);
        exam.setRequestDate(LocalDateTime.now());
        exam.setInstructions(dto.getInstructions());
        exam.setScheduledDate(scheduledDate);
        exam.setNote(dto.getNote());
        exam.setActive(Boolean.TRUE);

        return examRepository.save(exam);
    }

    public List<Exam> findAll() {
        return examRepository.findAllByActiveTrue();
    }

    public Exam findById(Long id) {
        return examRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
    }

    public List<Exam> findByPatientId(Long patientId) {
        return examRepository.findByPatientIdAndActiveTrue(patientId);
    }

    public List<Exam> findByDoctorId(Long doctorId) {
        return examRepository.findByDoctorIdAndActiveTrue(doctorId);
    }

    public List<Exam> findByStatusId(String statusId) {
        return examRepository.findByStatusIdAndActiveTrue(statusId);
    }

    public List<Exam> findByTypeId(String typeId) {
        return examRepository.findByTypeIdAndActiveTrue(typeId);
    }

    @Transactional
    public void deleteById(Long id) {
        Exam exam = findById(id);
        exam.setActive(Boolean.FALSE);
        examRepository.save(exam);
    }

    public ExamResponseDTO toResponseDTO(Exam exam) {
        ExamResponseDTO dto = new ExamResponseDTO();

        dto.setId(exam.getId());
        dto.setDoctorId(exam.getDoctor().getId());
        dto.setPatientId(exam.getPatient().getId());
        dto.setExamTypeId(exam.getType().getId());
        dto.setExamStatusId(exam.getStatus().getId());
        dto.setRequestDate(exam.getRequestDate());
        dto.setScheduledDate(exam.getScheduledDate());
        dto.setInstructions(exam.getInstructions());
        dto.setNote(exam.getNote());
        dto.setUpdatedAt(exam.getUpdatedAt());
        dto.setUpdatedBy(exam.getUpdatedBy());

        dto.setExamTypeDescription(exam.getType().getDescription());
        dto.setExamStatusDescription(exam.getStatus().getDescription());
        dto.setDoctorName(exam.getDoctor().getName());
        dto.setPatientName(exam.getPatient().getName());
        return dto;
    }
}

