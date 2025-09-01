package com.tcc.alzheimer.controller.roles;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.CaregiverDto;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.service.roles.CaregiverService;

@RestController
@RequestMapping("/carregivers")
public class CaregiverController {

    private final CaregiverService service;

    public CaregiverController(CaregiverService service) {
        this.service = service;
    }

    @GetMapping
    public List<Caregiver> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Caregiver> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Caregiver> create(@RequestBody CaregiverDto dto) {
        Caregiver caregiver = new Caregiver();
        caregiver.setCpf(dto.getCpf());
        caregiver.setName(dto.getName());
        caregiver.setEmail(dto.getEmail());
        caregiver.setPhone(dto.getPhone());
        caregiver.setBirthdate(dto.getBirthdate());
        caregiver.setGender(dto.getGender());
        caregiver.setAddress(dto.getAddress());
        caregiver.setPassword(dto.getPassword());
        caregiver.setType(dto.getUserType());

        return ResponseEntity.ok(service.save(caregiver, dto.getPatientEmails()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caregiver> update(@PathVariable Long id, @RequestBody CaregiverDto dto) {
        Caregiver caregiver = new Caregiver();
        caregiver.setCpf(dto.getCpf());
        caregiver.setName(dto.getName());
        caregiver.setEmail(dto.getEmail());
        caregiver.setPhone(dto.getPhone());
        caregiver.setBirthdate(dto.getBirthdate());
        caregiver.setGender(dto.getGender());
        caregiver.setAddress(dto.getAddress());
        caregiver.setPassword(dto.getPassword());
        caregiver.setType(dto.getUserType());

        return ResponseEntity.ok(service.update(id, caregiver, dto.getPatientEmails()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/patients")
    public ResponseEntity<List<Patient>> getPatients(@PathVariable Long id) {
        Caregiver caregiver = service.findById(id);
        return ResponseEntity.ok(service.getPatients(caregiver));
    }
}
