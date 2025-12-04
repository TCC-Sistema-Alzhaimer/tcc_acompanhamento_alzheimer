package com.tcc.alzheimer.controller.auth;

import com.tcc.alzheimer.dto.auth.ResetPasswordDTO;
import com.tcc.alzheimer.dto.auth.VerifyUserDTO;
import com.tcc.alzheimer.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final AuthService authService;

    @PostMapping("/verify")
    public ResponseEntity<Long> verifyUser(@RequestBody VerifyUserDTO dto) {
        Long userId = authService.verifyUserForReset(dto);
        
        return ResponseEntity.ok(userId);
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordDTO dto) {
        authService.resetPassword(dto);
        
        return ResponseEntity.ok().build();
    }
}