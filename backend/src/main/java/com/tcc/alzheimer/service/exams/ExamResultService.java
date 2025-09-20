package com.tcc.alzheimer.service.exams;

import com.tcc.alzheimer.dto.exams.ExamResultUploadResponseDTO;
import com.tcc.alzheimer.dto.files.FileUploadResponseDTO;
import com.tcc.alzheimer.exception.AccessDeniedException;
import com.tcc.alzheimer.exception.FileUploadException;
import com.tcc.alzheimer.exception.InvalidFileException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.model.exams.ExamResult;
import com.tcc.alzheimer.model.files.File;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.repository.exams.ExamRepository;
import com.tcc.alzheimer.repository.exams.ExamResultRepository;
import com.tcc.alzheimer.repository.files.FileRepository;
import com.tcc.alzheimer.service.auth.AuthService;
import com.tcc.alzheimer.service.files.FirebaseStorageService;
import com.tcc.alzheimer.model.enums.UserType;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import java.util.UUID;

@Service
public class ExamResultService {

    private final FirebaseStorageService firebaseStorageService;
    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;
    private final FileRepository fileRepository;
    private final AuthService authService;

    // Tipos de arquivo permitidos
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif");

    public ExamResultService(
            FirebaseStorageService firebaseStorageService,
            ExamRepository examRepository,
            ExamResultRepository examResultRepository,
            FileRepository fileRepository,
            AuthService authService) {
        this.firebaseStorageService = firebaseStorageService;
        this.examRepository = examRepository;
        this.examResultRepository = examResultRepository;
        this.fileRepository = fileRepository;
        this.authService = authService;
    }

    /**
     * Faz upload do resultado do exame
     * 
     * @param examId ID do exame
     * @param file   Arquivo a ser enviado
     * @return DTO com informações completas do upload
     * @throws InvalidFileException      se arquivo for inválido
     * @throws ResourceNotFoundException se exame não for encontrado
     * @throws AccessDeniedException     se usuário não tiver permissão
     * @throws FileUploadException       se houver erro no upload
     */
    public ExamResultUploadResponseDTO uploadExamResult(Long examId, MultipartFile file) {
        // Validações básicas
        validateFile(file);

        // Buscar o exame
        Exam exam = findExamById(examId);

        // Verificar permissões
        User currentUser = authService.getCurrentUser();
        validateUserAccess(currentUser, exam);

        // Fazer upload para Firebase
        String folder = "exams/" + exam.getPatient().getId();
        FileUploadResponseDTO uploadResponse;
        try {
            uploadResponse = firebaseStorageService.uploadFile(file, folder);
        } catch (IOException e) {
            throw FileUploadException.uploadFailed(file.getOriginalFilename(), e);
        }

        // Salvar arquivo na base de dados
        File fileEntity = createFileEntity(file, uploadResponse, currentUser);
        fileEntity = fileRepository.save(fileEntity);

        // Criar relacionamento exam-result (tabela de relacionamento pura)
        ExamResult examResult = ExamResult.builder()
                .exam(exam)
                .file(fileEntity)
                .build();

        examResult = examResultRepository.save(examResult); // Construir DTO de resposta
        return buildUploadResponseDTO(examResult, exam, fileEntity, uploadResponse);
    }

    /**
     * Valida o arquivo enviado
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw InvalidFileException.emptyFile();
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw InvalidFileException.invalidType();
        }
    }

    /**
     * Busca o exame por ID
     */
    private Exam findExamById(Long examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exame não encontrado com ID: " + examId));
    }

    /**
     * Valida se o usuário tem acesso ao exame
     */
    private void validateUserAccess(User user, Exam exam) {
        if (!hasAccessToExam(user, exam)) {
            throw AccessDeniedException.forExamResult();
        }
    }

    /**
     * Verifica se o usuário atual tem acesso ao exame.
     * PATIENT: pode acessar apenas seus próprios exames
     * CAREGIVER: pode acessar exames dos pacientes que cuida
     */
    private boolean hasAccessToExam(User user, Exam exam) {
        String userRole = authService.getCurrentUserRole();

        if (UserType.PATIENT.name().equals(userRole)) {
            // Paciente só pode anexar resultado aos próprios exames
            return exam.getPatient().getId().equals(user.getId());
        }

        if (UserType.CAREGIVER.name().equals(userRole)) {
            // Verificar se o cuidador cuida deste paciente
            Caregiver caregiver = (Caregiver) user;
            Patient examPatient = exam.getPatient();

            // Verificar se o paciente do exame está na lista de pacientes do cuidador
            return caregiver.getPatients().stream()
                    .anyMatch(patient -> patient.getId().equals(examPatient.getId()));
        }

        return false;
    }

    /**
     * Cria a entity File com os dados do upload
     */
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

    /**
     * Extrai a extensão do arquivo
     */
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

    /**
     * Extrai o nome randômico do fileId retornado pelo Firebase
     */
    private String extractRandomName(String fileId) {
        if (fileId == null || fileId.isEmpty()) {
            return UUID.randomUUID().toString();
        }

        // O fileId do Firebase já contém o path completo
        // Extrair apenas o nome do arquivo
        String fileName = fileId.substring(fileId.lastIndexOf('/') + 1);

        // Remover a extensão para ter apenas o nome randômico
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(0, dotIndex);
        }

        return fileName;
    }

    /**
     * Constrói o DTO de resposta com todas as informações do upload
     */
    private ExamResultUploadResponseDTO buildUploadResponseDTO(
            ExamResult examResult,
            Exam exam,
            File fileEntity,
            FileUploadResponseDTO uploadResponse) {

        String mimeType = fileEntity.getMimeType();

        com.tcc.alzheimer.dto.files.FileInfoDTO fileInfo = new com.tcc.alzheimer.dto.files.FileInfoDTO();
        fileInfo.setId(fileEntity.getId().toString()); // ID da base de dados (PK)
        fileInfo.setName(fileEntity.getName());
        fileInfo.setSize(fileEntity.getSize());
        fileInfo.setFormattedSize(formatFileSize(fileEntity.getSize()));
        fileInfo.setMimeType(mimeType);
        // Gerar link dinamicamente
        fileInfo.setDownloadLink(firebaseStorageService.generateDownloadLink(fileEntity.getFilePath()));
        fileInfo.setFileType(getFileTypeDescription(mimeType));
        fileInfo.setIsImage(mimeType != null && mimeType.startsWith("image/"));
        fileInfo.setIsPdf("application/pdf".equals(mimeType));
        fileInfo.setCreatedTime(fileEntity.getCreationDate());
        fileInfo.setModifiedTime(fileEntity.getCreationDate());

        return ExamResultUploadResponseDTO.builder()
                .examResultId(examResult.getId())
                .examId(exam.getId())
                .examType(exam.getType().getDescription())
                .patientId(exam.getPatient().getId())
                .patientName(exam.getPatient().getName())
                .file(fileInfo)
                .message("Resultado do exame anexado com sucesso")
                .uploadDate(fileEntity.getCreationDate()) // Data vem do File entity
                .build();
    }

    /**
     * Formata o tamanho do arquivo em formato legível
     */
    private String formatFileSize(Long sizeInBytes) {
        if (sizeInBytes == null || sizeInBytes == 0) {
            return "0 B";
        }

        String[] units = { "B", "KB", "MB", "GB" };
        int unitIndex = 0;
        double size = sizeInBytes.doubleValue();

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return String.format("%.1f %s", size, units[unitIndex]);
    }

    /**
     * Retorna descrição amigável do tipo de arquivo
     */
    private String getFileTypeDescription(String mimeType) {
        if (mimeType == null) {
            return "Arquivo";
        }

        switch (mimeType) {
            case "application/pdf":
                return "Documento PDF";
            case "image/jpeg":
            case "image/jpg":
                return "Imagem JPEG";
            case "image/png":
                return "Imagem PNG";
            case "image/gif":
                return "Imagem GIF";
            default:
                return "Arquivo";
        }
    }
}