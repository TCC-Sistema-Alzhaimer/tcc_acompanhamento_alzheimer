package com.tcc.alzheimer.controller.roles;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

}
