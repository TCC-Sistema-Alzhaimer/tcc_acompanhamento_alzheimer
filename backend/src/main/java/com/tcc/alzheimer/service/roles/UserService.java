package com.tcc.alzheimer.service.roles;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.dto.roles.BasicDtoForList;
import com.tcc.alzheimer.exception.BadRequestException;
import com.tcc.alzheimer.exception.ResourceNotFoundException;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.repository.roles.UserRepository;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

        private final UserRepository repo;
        private final PatientRepository patientRepository;
        private final CaregiverRepository caregiverRepository;

        public User findByEmail(String email) {
                return repo.findByEmailAndActiveTrue(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario com email '" + email + "' nao encontrado"));
        }

        public List<BasicDtoForList> getAllUsers() {
                return repo.findAllByActiveTrue().stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

        public List<BasicDtoForList> searchUsers(String query) {
                return repo.searchActiveByNameOrEmail(query).stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

        public List<BasicDtoForList> getPatientsAndCaregivers() {
                return repo.findByTypeInAndActiveTrue(List.of(UserType.PATIENT.name(), UserType.CAREGIVER.name()))
                                .stream()
                                .map(user -> new BasicDtoForList(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getPhone(),
                                                user.getType()))
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<BasicDtoForList> searchUsersForChat(String requesterEmail, String query) {
                if (requesterEmail == null || requesterEmail.isBlank()) {
                        throw new BadRequestException("Usuário não autenticado.");
                }

                if (query == null || query.trim().length() < 3) {
                        throw new BadRequestException("Informe pelo menos 3 caracteres para buscar usuários.");
                }

                String sanitizedQuery = query.trim();
                String lowerQuery = sanitizedQuery.toLowerCase();

                User requester = repo.findByEmailAndActiveTrue(requesterEmail)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario com email '" + requesterEmail + "' nao encontrado"));

                return switch (requester.getType()) {
                        case ADMINISTRATOR, DOCTOR -> filterAndMapUsers(
                                        repo.searchActiveByNameOrEmail(sanitizedQuery),
                                        lowerQuery,
                                        requester.getId(),
                                        false);
                        case CAREGIVER -> {
                                Caregiver caregiver = caregiverRepository.findByIdAndActiveTrue(requester.getId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Cuidador com id '" + requester.getId()
                                                                                + "' nao encontrado"));
                                var associated = new LinkedHashSet<User>();
                                if (caregiver.getPatients() != null) {
                                        associated.addAll(caregiver.getPatients());
                                }
                                var doctors = repo.searchActiveByNameOrEmailAndType(sanitizedQuery, UserType.DOCTOR);
                                yield mergeAndFilterForRestrictedRoles(associated, doctors, lowerQuery,
                                                caregiver.getId());
                        }
                        case PATIENT -> {
                                Patient patient = patientRepository.findByIdAndActiveTrue(requester.getId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Paciente com id '" + requester.getId()
                                                                                + "' nao encontrado"));
                                var associated = new LinkedHashSet<User>();
                                if (patient.getCaregivers() != null) {
                                        associated.addAll(patient.getCaregivers());
                                }
                                if (patient.getDoctors() != null) {
                                        associated.addAll(patient.getDoctors());
                                }
                                var doctors = repo.searchActiveByNameOrEmailAndType(sanitizedQuery, UserType.DOCTOR);
                                yield mergeAndFilterForRestrictedRoles(associated, doctors, lowerQuery,
                                                patient.getId());
                        }
                        default -> List.of();
                };
        }

        private List<BasicDtoForList> mergeAndFilterForRestrictedRoles(Collection<User> associated,
                        Collection<User> doctorMatches,
                        String lowerQuery,
                        Long requesterId) {
                return filterAndMapUsers(
                                Stream.concat(
                                                associated != null ? associated.stream() : Stream.empty(),
                                                doctorMatches != null ? doctorMatches.stream() : Stream.empty())
                                                .toList(),
                                lowerQuery,
                                requesterId,
                                true);
        }

        private List<BasicDtoForList> filterAndMapUsers(Collection<User> users,
                        String lowerQuery,
                        Long requesterId,
                        boolean excludeAdmins) {
                if (users == null || users.isEmpty()) {
                        return List.of();
                }

                Map<Long, BasicDtoForList> unique = new LinkedHashMap<>();

                for (User user : users) {
                        if (user == null || user.getId() == null) {
                                continue;
                        }
                        if (Objects.equals(requesterId, user.getId())) {
                                continue;
                        }
                        if (excludeAdmins && user.getType() == UserType.ADMINISTRATOR) {
                                continue;
                        }
                        if (!Boolean.TRUE.equals(user.getActive())) {
                                continue;
                        }
                        if (!matchesQuery(user, lowerQuery)) {
                                continue;
                        }
                        unique.putIfAbsent(user.getId(),
                                        new BasicDtoForList(
                                                        user.getId(),
                                                        user.getName(),
                                                        user.getEmail(),
                                                        user.getPhone(),
                                                        user.getType()));
                }

                return new ArrayList<>(unique.values());
        }

        private boolean matchesQuery(User user, String lowerQuery) {
                String name = user.getName() != null ? user.getName().toLowerCase() : "";
                String email = user.getEmail() != null ? user.getEmail().toLowerCase() : "";
                return name.contains(lowerQuery) || email.contains(lowerQuery);
        }

}
