package com.tcc.alzheimer.exception;

/**
 * Exceção lançada quando um arquivo enviado é inválido
 */
public class InvalidFileException extends RuntimeException {

    public InvalidFileException(String message) {
        super(message);
    }

    public InvalidFileException(String message, Throwable cause) {
        super(message, cause);
    }

    public static InvalidFileException emptyFile() {
        return new InvalidFileException("Arquivo está vazio");
    }

    public static InvalidFileException invalidType() {
        return new InvalidFileException("Tipo de arquivo não permitido. Aceitos: PDF, JPEG, JPG, PNG, GIF");
    }
}