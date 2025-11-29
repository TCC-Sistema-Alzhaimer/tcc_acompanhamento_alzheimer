package com.tcc.alzheimer.service.files;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.tcc.alzheimer.dto.files.FileInfoDTO;
import com.tcc.alzheimer.dto.files.FileUploadResponseDTO;

@Service
public class FirebaseStorageService {

    private final Bucket bucket;
    private final Storage storage;

    public FirebaseStorageService(Bucket bucket, Storage storage) {
        this.bucket = bucket;
        this.storage = storage;
    }

    public FileUploadResponseDTO uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo está vazio");
        }

        String fileName = generateUniqueFileName(file.getOriginalFilename(), folder);

        BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName)
                .setContentType(file.getContentType())
                .build();

        Blob blob = storage.create(blobInfo, file.getBytes());
        String signedUrl = blob.signUrl(7, TimeUnit.DAYS).toString();

        FileUploadResponseDTO response = new FileUploadResponseDTO();
        response.setFileId(blob.getName());
        response.setFileName(file.getOriginalFilename());
        response.setWebViewLink(signedUrl);
        response.setWebContentLink(signedUrl);
        response.setSize(blob.getSize());
        response.setMessage("Arquivo enviado com sucesso para Firebase Storage");

        return response;
    }

    public byte[] downloadFile(String fileName) throws IOException {
        Blob blob = storage.get(bucket.getName(), fileName);
        if (blob == null) {
            throw new IOException("Arquivo não encontrado: " + fileName);
        }
        return blob.getContent();
    }

    public List<FileInfoDTO> listFiles(String prefix, Integer pageSize) {
        List<FileInfoDTO> fileInfos = new ArrayList<>();

        Storage.BlobListOption[] options = prefix != null
                ? new Storage.BlobListOption[] { Storage.BlobListOption.prefix(prefix),
                        Storage.BlobListOption.pageSize(pageSize != null ? pageSize : 50) }
                : new Storage.BlobListOption[] { Storage.BlobListOption.pageSize(pageSize != null ? pageSize : 50) };

        Iterable<Blob> blobs = storage.list(bucket.getName(), options).iterateAll();

        for (Blob blob : blobs) {
            if (!blob.getName().endsWith("/")) {
                FileInfoDTO dto = convertBlobToFileInfo(blob);
                fileInfos.add(dto);
            }
        }

        return fileInfos;
    }

    public List<FileInfoDTO> searchFilesByName(String fileName, Integer pageSize) {
        List<FileInfoDTO> allFiles = listFiles(null, pageSize);
        List<FileInfoDTO> matchingFiles = new ArrayList<>();

        String searchTerm = fileName.toLowerCase();

        for (FileInfoDTO file : allFiles) {
            if (file.getName().toLowerCase().contains(searchTerm)) {
                matchingFiles.add(file);
            }
        }

        return matchingFiles;
    }

    public boolean deleteFile(String fileName) {
        Blob blob = storage.get(bucket.getName(), fileName);
        if (blob == null) {
            return false;
        }
        return storage.delete(bucket.getName(), fileName);
    }

    public void createFolder(String folderName, String parentFolder) {
        String folderPath = parentFolder != null
                ? parentFolder + "/" + folderName + "/"
                : folderName + "/";

        BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), folderPath + ".keep")
                .setContentType("text/plain")
                .build();

        storage.create(blobInfo, "".getBytes());
    }

    private String generateUniqueFileName(String originalFileName, String folder) {
        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + "_" + originalFileName;

        return folder != null && !folder.isEmpty()
                ? folder + "/" + fileName
                : fileName;
    }

    private FileInfoDTO convertBlobToFileInfo(Blob blob) {
        FileInfoDTO dto = new FileInfoDTO();
        dto.setId(blob.getName());
        dto.setName(extractFileName(blob.getName()));
        dto.setSize(blob.getSize());
        dto.setFormattedSize(formatFileSize(blob.getSize()));
        dto.setMimeType(blob.getContentType());

        // Gerar link dinamicamente (não armazenar)
        dto.setDownloadLink(generateDownloadLink(blob.getName()));

        // Definir tipo de arquivo e flags
        String mimeType = blob.getContentType();
        dto.setFileType(getFileTypeDescription(mimeType));
        dto.setIsImage(mimeType != null && mimeType.startsWith("image/"));
        dto.setIsPdf("application/pdf".equals(mimeType));

        if (blob.getCreateTimeOffsetDateTime() != null) {
            dto.setCreatedTime(blob.getCreateTimeOffsetDateTime().toLocalDateTime());
        }

        if (blob.getUpdateTimeOffsetDateTime() != null) {
            dto.setModifiedTime(blob.getUpdateTimeOffsetDateTime().toLocalDateTime());
        }

        return dto;
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

    private String extractFileName(String fullPath) {
        if (fullPath.contains("/")) {
            return fullPath.substring(fullPath.lastIndexOf("/") + 1);
        }
        return fullPath;
    }

    /**
     * Gera um link de download temporário para um arquivo
     * 
     * @param filePath Caminho do arquivo no Firebase Storage
     * @return URL temporária para download/visualização
     */
    public String generateDownloadLink(String filePath) {
        try {
            Blob blob = storage.get(bucket.getName(), filePath);
            if (blob == null) {
                return null;
            }
            return blob.signUrl(7, TimeUnit.DAYS).toString();
        } catch (Exception e) {
            return null;
        }
    }
}