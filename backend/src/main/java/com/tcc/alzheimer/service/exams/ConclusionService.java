package com.tcc.alzheimer.service.exams;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tcc.alzheimer.dto.exams.ConclusionCreateDTO;
import com.tcc.alzheimer.dto.exams.ConclusionResponseDTO;
import com.tcc.alzheimer.dto.files.FileInfoDTO;
import com.tcc.alzheimer.exception.FileUploadException;
import com.tcc.alzheimer.exception.InvalidFileException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.enums.ExamStatusType;
import com.tcc.alzheimer.model.exams.Conclusion;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.model.files.File;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.repository.exams.ConclusionRepository;
import com.tcc.alzheimer.repository.exams.ExamRepository;
import com.tcc.alzheimer.repository.files.FileRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.service.auth.AuthService;
import com.tcc.alzheimer.service.files.FirebaseStorageService;
import com.tcc.alzheimer.util.FileUtils;
import com.tcc.alzheimer.service.exams.ExamService;

@Service
public class ConclusionService {

    private final ConclusionRepository conclusionRepository;
    private final ExamRepository examRepository;
    private final DoctorRepository doctorRepository;
    private final FirebaseStorageService firebaseStorageService;
    private final FileRepository fileRepository;
    private final AuthService authService;
    private final ExamService examService;

    public ConclusionService(ConclusionRepository conclusionRepository,
            ExamRepository examRepository,
            DoctorRepository doctorRepository,
            FirebaseStorageService firebaseStorageService,
            FileRepository fileRepository,
            AuthService authService,
            ExamService examService) {
        this.conclusionRepository = conclusionRepository;
        this.examRepository = examRepository;
        this.doctorRepository = doctorRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.fileRepository = fileRepository;
        this.authService = authService;
        this.examService = examService;
    }

    private static final java.util.List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif");

    public ConclusionResponseDTO createConclusion(ConclusionCreateDTO dto, MultipartFile[] files) {
        Exam exam = examRepository.findById(dto.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + dto.getExamId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        Conclusion c = new Conclusion();
        c.setExam(exam);
        c.setDoctor(doctor);
        c.setDescription(dto.getDescription());
        c.setNotes(dto.getNotes());
        c.setConclusion(dto.getConclusion());
        c.setCreatedAt(LocalDateTime.now());
        c = conclusionRepository.save(c);

        if (files != null) {
            String folder = "conclusions/" + exam.getPatient().getId();
            Set<File> savedFiles = Arrays.stream(files)
                    .peek(f -> {
                        if (f.isEmpty())
                            throw InvalidFileException.emptyFile();
                        if (!ALLOWED_CONTENT_TYPES.contains(f.getContentType()))
                            throw InvalidFileException.invalidType();
                    })
                    .map(f -> {
                        try {
                            com.tcc.alzheimer.dto.files.FileUploadResponseDTO uploadResponse = firebaseStorageService
                                    .uploadFile(f, folder);
                            File fileEntity = File.builder()
                                    .name(f.getOriginalFilename())
                                    .extension(getFileExtension(f.getOriginalFilename()))
                                    .randomName(extractRandomName(uploadResponse.getFileId()))
                                    .size(f.getSize())
                                    .creationDate(LocalDateTime.now())
                                    .addedBy(authService.getCurrentUser())
                                    .mimeType(f.getContentType())
                                    .filePath(uploadResponse.getFileId())
                                    .build();
                            return fileRepository.save(fileEntity);
                        } catch (IOException e) {
                            throw FileUploadException.uploadFailed(f.getOriginalFilename(), e);
                        }
                    })
                    .collect(Collectors.toSet());

            c.getFiles().addAll(savedFiles);
            c = conclusionRepository.save(c);
        }
        examService.changeExamStatus(
                exam.getId().toString(),
                ExamStatusType.COMPLETED.getId()
        );
        return mapToDto(c);
    }

    public ConclusionResponseDTO getById(Long id) {
        Conclusion c = conclusionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conclusion not found with id: " + id));
        return mapToDto(c);
    }

    public List<ConclusionResponseDTO> getByExamId(Long examId) {
        List<Conclusion> list = conclusionRepository.findByExamId(examId);
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ConclusionResponseDTO> getByPatientId(Long patientId) {
        List<Conclusion> list = conclusionRepository.findByExamPatientIdOrderByCreatedAtDesc(patientId);
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ConclusionResponseDTO updateConclusion(Long id, ConclusionCreateDTO dto) {
        Conclusion c = conclusionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conclusion not found with id: " + id));

        c.setDescription(dto.getDescription());
        c.setNotes(dto.getNotes());
        c.setConclusion(dto.getConclusion());
        c.setUpdatedAt(LocalDateTime.now());

        c = conclusionRepository.save(c);
        return mapToDto(c);
    }

    public void delete(Long id) {
        if (!conclusionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Conclusion not found with id: " + id);
        }
        conclusionRepository.deleteById(id);
    }

    private ConclusionResponseDTO mapToDto(Conclusion c) {
        ConclusionResponseDTO dto = new ConclusionResponseDTO();
        dto.setId(c.getId());
        dto.setExamId(c.getExam().getId());
        dto.setPatientId(c.getExam().getPatient().getId());
        dto.setDoctorId(c.getDoctor().getId());
        dto.setDoctorName(c.getDoctor().getName());
        dto.setPatientName(c.getExam().getPatient().getName());
        dto.setTitle(c.getDescription()); // description serves as title
        dto.setContent(c.getConclusion()); // conclusion serves as content
        dto.setDescription(c.getDescription());
        dto.setNotes(c.getNotes());
        dto.setConclusion(c.getConclusion());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setUpdatedBy(c.getUpdatedBy() != null ? c.getUpdatedBy().getId() : null);
        // map files
        if (c.getFiles() != null && !c.getFiles().isEmpty()) {
            java.util.List<FileInfoDTO> fileInfos = c.getFiles().stream().map(f -> {
                FileInfoDTO fi = new FileInfoDTO();
                fi.setId(f.getId().toString());
                fi.setName(f.getName());
                fi.setMimeType(f.getMimeType());
                fi.setSize(f.getSize());
                fi.setFormattedSize(FileUtils.formatFileSize(f.getSize()));
                fi.setCreatedTime(f.getCreationDate());
                fi.setModifiedTime(f.getCreationDate());
                fi.setDownloadLink(firebaseStorageService.generateDownloadLink(f.getFilePath()));
                fi.setFileType(FileUtils.getFileTypeDescription(f.getMimeType()));
                fi.setIsImage(f.getMimeType() != null && f.getMimeType().startsWith("image/"));
                fi.setIsPdf("application/pdf".equals(f.getMimeType()));
                return fi;
            }).collect(Collectors.toList());
            dto.setFiles(fileInfos);
            // Also populate attachmentUrls for frontend compatibility
            dto.setAttachmentUrls(fileInfos.stream()
                    .map(FileInfoDTO::getDownloadLink)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty())
            return "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == fileName.length() - 1)
            return "";
        return fileName.substring(dotIndex + 1).toLowerCase();
    }

    private String extractRandomName(String fileId) {
        if (fileId == null || fileId.isEmpty())
            return UUID.randomUUID().toString();
        String fileName = fileId.substring(fileId.lastIndexOf('/') + 1);
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0)
            return fileName.substring(0, dotIndex);
        return fileName;
    }

}
