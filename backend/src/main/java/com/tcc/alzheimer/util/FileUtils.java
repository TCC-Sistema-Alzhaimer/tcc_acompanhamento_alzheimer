package com.tcc.alzheimer.util;

/**
 * Utilitários para manipulação de arquivos
 */
public class FileUtils {

    /**
     * Formata o tamanho do arquivo em formato legível
     */
    public static String formatFileSize(Long sizeInBytes) {
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
    public static String getFileTypeDescription(String mimeType) {
        if (mimeType == null) {
            return "Arquivo";
        }

        return switch (mimeType) {
            case "application/pdf" -> "Documento PDF";
            case "image/jpeg", "image/jpg" -> "Imagem JPEG";
            case "image/png" -> "Imagem PNG";
            case "image/gif" -> "Imagem GIF";
            default -> "Arquivo";
        };
    }
}