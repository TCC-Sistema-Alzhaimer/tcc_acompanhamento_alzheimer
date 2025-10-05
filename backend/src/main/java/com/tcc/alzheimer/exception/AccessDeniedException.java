package com.tcc.alzheimer.exception;

/**
 * Exceção lançada quando usuário não tem acesso a um recurso específico
 */
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }

    public static AccessDeniedException forExamResult() {
        return new AccessDeniedException("Usuário não tem permissão para anexar resultado neste exame");
    }
}