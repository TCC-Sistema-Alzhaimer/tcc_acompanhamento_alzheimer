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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.dto.roles.doctor.DoctorPostAndPutDto;
import com.tcc.alzheimer.dto.roles.doctor.DoctorGetDto;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.service.roles.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @GetMapping
    public List<DoctorGetDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorGetDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@RequestBody DoctorPostAndPutDto dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody DoctorPostAndPutDto dto) {
        Doctor doctor = new Doctor();
        doctor.setCpf(dto.getCpf());
        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setCrm(dto.getCrm());
        doctor.setPassword(dto.getPassword());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setType(dto.getUserType());

        return ResponseEntity.ok(service.update(id, doctor, dto.getPatientEmails()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/patients")
    public ResponseEntity<List<BasicDtoForList>> getPatients(
            @PathVariable Long id,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String serviceType) {
        
        return ResponseEntity.ok(service.searchUsersByDoc(id, query, serviceType));
    }
}
