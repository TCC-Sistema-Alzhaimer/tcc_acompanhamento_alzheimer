package com.tcc.alzheimer.exception;

/**
 * Exceção lançada quando há erro no upload de arquivo
 */
public class FileUploadException extends RuntimeException {

    public FileUploadException(String message) {
        super(message);
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }

    public static FileUploadException uploadFailed(String fileName, Throwable cause) {
        return new FileUploadException("Erro ao fazer upload do arquivo: " + fileName, cause);
    }
}