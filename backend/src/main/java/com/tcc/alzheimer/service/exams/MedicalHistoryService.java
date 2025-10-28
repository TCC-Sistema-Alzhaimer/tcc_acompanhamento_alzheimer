package com.tcc.alzheimer.service.exams;

import com.tcc.alzheimer.dto.exams.MedicalHistoryCreateDTO;
import com.tcc.alzheimer.dto.exams.MedicalHistoryResponseDTO;
import com.tcc.alzheimer.dto.files.FileUploadResponseDTO;
import com.tcc.alzheimer.exception.FileUploadException;
import com.tcc.alzheimer.exception.InvalidFileException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.exams.MedicalHistory;
import com.tcc.alzheimer.model.files.File;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.exams.MedicalHistoryRepository;
import com.tcc.alzheimer.repository.files.FileRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.service.auth.AuthService;
import com.tcc.alzheimer.service.files.FirebaseStorageService;
import com.tcc.alzheimer.util.FileUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class MedicalHistoryService {

    private final FirebaseStorageService firebaseStorageService;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final FileRepository fileRepository;
    private final PatientRepository patientRepository;
    private final AuthService authService;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif");

    public MedicalHistoryService(FirebaseStorageService firebaseStorageService,
            MedicalHistoryRepository medicalHistoryRepository,
            FileRepository fileRepository,
            PatientRepository patientRepository,
            AuthService authService) {
        this.firebaseStorageService = firebaseStorageService;
        this.medicalHistoryRepository = medicalHistoryRepository;
        this.fileRepository = fileRepository;
        this.patientRepository = patientRepository;
        this.authService = authService;
    }

    public MedicalHistoryResponseDTO createMedicalHistory(MedicalHistoryCreateDTO dto, MultipartFile[] files) {
        // Validar paciente
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        User currentUser = authService.getCurrentUser();

        MedicalHistory mh = new MedicalHistory();
        mh.setPatient(patient);
        mh.setDescription(dto.getDescription());
        mh.setCreatedAt(LocalDateTime.now());
        mh.setCreatedBy(currentUser);

        // Salvar inicialmente para ter ID
        mh = medicalHistoryRepository.save(mh);

        // Se houver arquivos, fazer upload e salvar na relação ManyToMany
        if (files != null) {
            String folder = "medical-history/" + patient.getId();
            Set<File> savedFiles = Arrays.stream(files)
                    .peek(this::validateFile)
                    .map(file -> {
                        try {
                            FileUploadResponseDTO uploadResponse = firebaseStorageService.uploadFile(file, folder);
                            File fileEntity = createFileEntity(file, uploadResponse, currentUser);
                            return fileRepository.save(fileEntity);
                        } catch (IOException e) {
                            throw FileUploadException.uploadFailed(file.getOriginalFilename(), e);
                        }
                    })
                    .collect(Collectors.toSet());

            mh.getFiles().addAll(savedFiles);
            mh = medicalHistoryRepository.save(mh);
        }

        // Construir DTO de resposta
        MedicalHistoryResponseDTO response = new MedicalHistoryResponseDTO();
        response.setId(mh.getId());
        response.setPatientId(mh.getPatient().getId());
        response.setDescription(mh.getDescription());
        response.setCreatedAt(mh.getCreatedAt());
        response.setCreatedBy(mh.getCreatedBy() != null ? mh.getCreatedBy().getId() : null);
        response.setUpdatedAt(mh.getUpdatedAt());
        response.setUpdatedBy(mh.getUpdatedBy() != null ? mh.getUpdatedBy().getId() : null);

        // arquivos -> FileInfoDTO
        List<com.tcc.alzheimer.dto.files.FileInfoDTO> fileInfos = mh.getFiles().stream().map(f -> {
            com.tcc.alzheimer.dto.files.FileInfoDTO fi = new com.tcc.alzheimer.dto.files.FileInfoDTO();
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

        response.setFiles(fileInfos);
        return response;
    }

    public MedicalHistoryResponseDTO getMedicalHistoryById(Long id) {
        MedicalHistory mh = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalHistory not found with id: " + id));
        return mapToResponse(mh);
    }

    public List<MedicalHistoryResponseDTO> getMedicalHistoriesByPatientId(Long patientId) {
        List<MedicalHistory> list = medicalHistoryRepository.findByPatientIdAndIsActiveTrue(patientId);
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void softDelete(Long id) {
        MedicalHistory mh = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalHistory not found with id: " + id));

        if (Boolean.FALSE.equals(mh.getIsActive())) {
            return; // já deletado
        }

        User currentUser = authService.getCurrentUser();
        mh.setIsActive(false);
        mh.setUpdatedAt(LocalDateTime.now());
        mh.setUpdatedBy(currentUser);
        medicalHistoryRepository.save(mh);
    }

    private MedicalHistoryResponseDTO mapToResponse(MedicalHistory mh) {
        MedicalHistoryResponseDTO response = new MedicalHistoryResponseDTO();
        response.setId(mh.getId());
        response.setPatientId(mh.getPatient().getId());
        response.setDescription(mh.getDescription());
        response.setCreatedAt(mh.getCreatedAt());
        response.setCreatedBy(mh.getCreatedBy() != null ? mh.getCreatedBy().getId() : null);
        response.setUpdatedAt(mh.getUpdatedAt());
        response.setUpdatedBy(mh.getUpdatedBy() != null ? mh.getUpdatedBy().getId() : null);

        List<com.tcc.alzheimer.dto.files.FileInfoDTO> fileInfos = mh.getFiles().stream().map(f -> {
            com.tcc.alzheimer.dto.files.FileInfoDTO fi = new com.tcc.alzheimer.dto.files.FileInfoDTO();
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

        response.setFiles(fileInfos);
        return response;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw InvalidFileException.emptyFile();
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw InvalidFileException.invalidType();
        }
    }

    private File createFileEntity(MultipartFile file, FileUploadResponseDTO uploadResponse, User currentUser) {
        return File.builder()
                .name(file.getOriginalFilename())
                .extension(getFileExtension(file.getOriginalFilename()))
                .randomName(extractRandomName(uploadResponse.getFileId()))
                .size(file.getSize())
                .creationDate(LocalDateTime.now())
                .addedBy(currentUser)
                .mimeType(file.getContentType())
                .filePath(uploadResponse.getFileId())
                .build();
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(dotIndex + 1).toLowerCase();
    }

    private String extractRandomName(String fileId) {
        if (fileId == null || fileId.isEmpty()) {
            return UUID.randomUUID().toString();
        }

        String fileName = fileId.substring(fileId.lastIndexOf('/') + 1);
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(0, dotIndex);
        }

        return fileName;
    }

}
