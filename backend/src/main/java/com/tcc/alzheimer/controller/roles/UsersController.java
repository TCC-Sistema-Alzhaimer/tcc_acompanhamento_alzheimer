package com.tcc.alzheimer.controller.roles;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.service.roles.UserService;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UserService service;

    public UsersController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<BasicDtoForList>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<BasicDtoForList>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(service.searchUsers(query));
    }

    @GetMapping("/patients-and-caregivers")
    public ResponseEntity<List<BasicDtoForList>> getPatientsAndCaregivers() {
        return ResponseEntity.ok(service.getPatientsAndCaregivers());
    }

    @GetMapping("/chat-search")
    public ResponseEntity<List<BasicDtoForList>> searchUsersForChat(@RequestParam String query) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? (String) authentication.getPrincipal() : null;
        return ResponseEntity.ok(service.searchUsersForChat(email, query));
    }

}
