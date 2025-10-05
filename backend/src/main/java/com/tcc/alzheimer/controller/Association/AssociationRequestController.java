package com.tcc.alzheimer.controller.Association;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.Association.AssociationRequestCreateDto;
import com.tcc.alzheimer.dto.Association.AssociationRequestRespondDto;
import com.tcc.alzheimer.dto.Association.AssociationRequestResponseDto;
import com.tcc.alzheimer.service.Association.AssociationRequestService;

@RestController
@RequestMapping("/requests")
public class AssociationRequestController {

    private final AssociationRequestService service;

    public AssociationRequestController(AssociationRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AssociationRequestResponseDto> create(@RequestBody AssociationRequestCreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<AssociationRequestResponseDto> respond(
            @PathVariable Long id,
            @RequestBody AssociationRequestRespondDto dto) {
        return ResponseEntity.ok(service.respond(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<AssociationRequestResponseDto>> findAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal(); // isso é o username do JWT, ou seja, o email
        return ResponseEntity.ok(service.findAllByUser(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssociationRequestResponseDto> findById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(service.findByIdForUser(id, email));
    }
}