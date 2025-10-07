package com.tcc.alzheimer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção lançada quando um usuário tenta realizar uma operação
 * para a qual não tem permissão baseada em sua role.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class InsufficientRoleException extends RuntimeException {

    public InsufficientRoleException(String message) {
        super(message);
    }

    public static InsufficientRoleException forRoleMismatch(String requiredRole, String currentRole) {
        return new InsufficientRoleException(
                String.format("Operação requer role '%s', mas usuário atual tem role '%s'",
                        requiredRole, currentRole));
    }

    public static InsufficientRoleException forOperation(String operation, String requiredRole) {
        return new InsufficientRoleException(
                String.format("Operação '%s' requer role '%s'", operation, requiredRole));
    }
}