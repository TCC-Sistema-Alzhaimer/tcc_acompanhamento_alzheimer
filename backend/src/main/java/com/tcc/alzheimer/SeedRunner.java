package com.tcc.alzheimer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tcc.alzheimer.model.Association.AssociationRequest;
import com.tcc.alzheimer.model.enums.ExamStatusType;
import com.tcc.alzheimer.model.enums.ExamTypeEnum;
import com.tcc.alzheimer.model.enums.IndicatorTypeEnum;
import com.tcc.alzheimer.model.enums.NotificationType;
import com.tcc.alzheimer.model.enums.RequestStatus;
import com.tcc.alzheimer.model.enums.RequestType;
import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.exams.Exam;
import com.tcc.alzheimer.model.exams.ExamResult;
import com.tcc.alzheimer.model.exams.ExamStatus;
import com.tcc.alzheimer.model.exams.ExamType;
import com.tcc.alzheimer.model.exams.IndicatorType;
import com.tcc.alzheimer.model.files.File;
import com.tcc.alzheimer.model.notifications.Notification;
import com.tcc.alzheimer.model.notifications.NotificationRecipient;
import com.tcc.alzheimer.model.roles.Administrator;
import com.tcc.alzheimer.model.roles.Caregiver;
import com.tcc.alzheimer.model.roles.Doctor;
import com.tcc.alzheimer.model.roles.Patient;
import com.tcc.alzheimer.model.roles.User;
import com.tcc.alzheimer.model.seed.SeedExecution;
import com.tcc.alzheimer.repository.Association.AssociationRequestRepository;
import com.tcc.alzheimer.repository.exams.ExamRepository;
import com.tcc.alzheimer.repository.exams.ExamResultRepository;
import com.tcc.alzheimer.repository.exams.ExamStatusRepository;
import com.tcc.alzheimer.repository.exams.ExamTypeRepository;
import com.tcc.alzheimer.repository.files.FileRepository;
import com.tcc.alzheimer.repository.indicator.IndicatorTypeRepository;
import com.tcc.alzheimer.repository.notifications.NotificationRepository;
import com.tcc.alzheimer.repository.roles.AdministratorRepository;
import com.tcc.alzheimer.repository.roles.CaregiverRepository;
import com.tcc.alzheimer.repository.roles.DoctorRepository;
import com.tcc.alzheimer.repository.roles.PatientRepository;
import com.tcc.alzheimer.repository.seed.SeedExecutionRepository;

import lombok.RequiredArgsConstructor;

@Component
@Order(3)
@RequiredArgsConstructor
public class SeedRunner implements CommandLineRunner {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final String DEFAULT_SEED_IDENTIFIER = "DEFAULT_DATA";

    private final AdministratorRepository administratorRepository;
    private final DoctorRepository doctorRepository;
    private final CaregiverRepository caregiverRepository;
    private final PatientRepository patientRepository;
    private final ExamRepository examRepository;
    private final ExamTypeRepository examTypeRepository;
    private final ExamStatusRepository examStatusRepository;
    private final FileRepository fileRepository;
    private final ExamResultRepository examResultRepository;
    private final AssociationRequestRepository associationRequestRepository;
    private final NotificationRepository notificationRepository;
    private final SeedExecutionRepository seedExecutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final IndicatorTypeRepository indicatorTypeRepository;

    @Value("${app.seed.force:false}")
    private boolean forceSeed;

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("\n>>> Starting SeedRunner...");

        if (!forceSeed && seedExecutionRepository.existsByName(DEFAULT_SEED_IDENTIFIER)) {
            System.out.println(">>> Seed already executed previously. Skipping.");
            return;
        }

        if (forceSeed) {
            System.out.println(">>> Forcing seed reset...");
            seedExecutionRepository.deleteByName(DEFAULT_SEED_IDENTIFIER);
            clearSeededData();
        }

        seedIndicatorTypes();
        
        Administrator admin = seedAdministrator();
        List<Doctor> doctors = seedDoctors();
        List<Caregiver> caregivers = seedCaregivers();
        List<Patient> patients = seedPatients(doctors, caregivers);

        List<Exam> exams = seedExams(doctors, patients);
        seedExamResults(exams);
        List<AssociationRequest> requests = seedAssociationRequests(patients, doctors, caregivers, admin);
        seedNotifications(admin, doctors, caregivers, patients, exams, requests);

        seedExecutionRepository.save(new SeedExecution(null, DEFAULT_SEED_IDENTIFIER, LocalDateTime.now()));

        System.out.println(">>> SeedRunner finished.\n");
    }

    private Administrator seedAdministrator() {
        String email = "admin@alzcare.com";
        Administrator admin = administratorRepository.findByEmail(email)
                .orElseGet(() -> {
                    Administrator fresh = new Administrator();
                    fresh.setCpf("00011122233");
                    fresh.setName("Equipe AlzCare");
                    fresh.setEmail(email);
                    fresh.setPhone("41999990001");
                    fresh.setPassword(passwordEncoder.encode("admin@123"));
                    fresh.setType(UserType.ADMINISTRATOR);
                    fresh.setActive(Boolean.TRUE);
                    return administratorRepository.save(fresh);
                });

        if (admin.getActive() == null) {
            admin.setActive(Boolean.TRUE);
            admin = administratorRepository.save(admin);
        }
        return admin;
    }

    private List<Doctor> seedDoctors() {
        List<DoctorSeed> seeds = List.of(
                new DoctorSeed("Dr. Ana Sousa", "ana.sousa@alzcare.com", "22133455660", "41988887770", "crm-pr-12345", "Neurologia", "docAna@123"),
                new DoctorSeed("Dr. Bruno Azevedo", "bruno.azevedo@alzcare.com", "55166788990", "41988887771", "crm-pr-67890", "Psiquiatria", "docBruno@123")
        );

        List<Doctor> result = new ArrayList<>();
        for (DoctorSeed seed : seeds) {
            Doctor doctor = doctorRepository.findByEmail(seed.email())
                    .orElseGet(() -> {
                        Doctor d = new Doctor();
                        d.setCpf(seed.cpf());
                        d.setName(seed.name());
                        d.setEmail(seed.email());
                        d.setPhone(seed.phone());
                        d.setPassword(passwordEncoder.encode(seed.rawPassword()));
                        d.setType(UserType.DOCTOR);
                        d.setCrm(seed.crm());
                        d.setSpeciality(seed.speciality());
                        d.setActive(Boolean.TRUE);
                        return d;
                    });

            if (doctor.getActive() == null) {
                doctor.setActive(Boolean.TRUE);
            }
            doctor.setCrm(seed.crm());
            doctor.setSpeciality(seed.speciality());
            doctor.setPhone(seed.phone());
            result.add(doctorRepository.save(doctor));
        }
        return result;
    }

    private List<Caregiver> seedCaregivers() {
        List<CaregiverSeed> seeds = List.of(
                new CaregiverSeed("Amanda Dias", "amanda.dias@alzcare.com", "77455888990", "41977776660", "careAmanda@123", LocalDate.of(1982, 5, 12), "FEMININO", "Rua das Araucarias, 45 - Curitiba"),
                new CaregiverSeed("Rita Campos", "rita.campos@alzcare.com", "66344577880", "41977776661", "careRita@123", LocalDate.of(1978, 11, 4), "FEMININO", "Rua XV de Novembro, 501 - Curitiba")
        );

        List<Caregiver> result = new ArrayList<>();
        for (CaregiverSeed seed : seeds) {
            Caregiver caregiver = caregiverRepository.findByEmail(seed.email())
                    .orElseGet(() -> {
                        Caregiver c = new Caregiver();
                        c.setCpf(seed.cpf());
                        c.setName(seed.name());
                        c.setEmail(seed.email());
                        c.setPhone(seed.phone());
                        c.setPassword(passwordEncoder.encode(seed.rawPassword()));
                        c.setType(UserType.CAREGIVER);
                        c.setActive(Boolean.TRUE);
                        return c;
                    });

            if (caregiver.getActive() == null) {
                caregiver.setActive(Boolean.TRUE);
            }
            caregiver.setBirthdate(seed.birthdate());
            caregiver.setGender(seed.gender());
            caregiver.setAddress(seed.address());
            caregiver.setPhone(seed.phone());
            result.add(caregiverRepository.save(caregiver));
        }
        return result;
    }

    private List<Patient> seedPatients(List<Doctor> doctors, List<Caregiver> caregivers) {
        Map<String, Doctor> doctorByEmail = doctors.stream()
                .collect(Collectors.toMap(Doctor::getEmail, doctor -> doctor));
        Map<String, Caregiver> caregiverByEmail = caregivers.stream()
                .collect(Collectors.toMap(Caregiver::getEmail, caregiver -> caregiver));

        List<PatientSeed> seeds = List.of(
                new PatientSeed("Maria da Silva", "maria.silva@alzcare.com", "99887766554", "41966665550", "patientMaria@123", LocalDate.of(1955, 3, 21), "FEMININO", "Rua das Flores, 120 - Curitiba", List.of("ana.sousa@alzcare.com"), List.of("amanda.dias@alzcare.com")),
                new PatientSeed("Marcos Souza", "marcos.souza@alzcare.com", "11442255889", "41966665551", "patientMarcos@123", LocalDate.of(1950, 8, 9), "MASCULINO", "Rua do Bosque, 480 - Curitiba", List.of("bruno.azevedo@alzcare.com"), List.of("rita.campos@alzcare.com")),
                new PatientSeed("Marina Melo", "marina.melo@alzcare.com", "22553377991", "41966665552", "patientMarina@123", LocalDate.of(1948, 12, 2), "FEMININO", "Rua Sete, 200 - Curitiba", List.of("ana.sousa@alzcare.com"), List.of("amanda.dias@alzcare.com", "rita.campos@alzcare.com"))
        );

        List<Patient> result = new ArrayList<>();
        for (PatientSeed seed : seeds) {
            Patient patient = patientRepository.findByEmail(seed.email())
                    .orElseGet(() -> {
                        Patient p = new Patient();
                        p.setCpf(seed.cpf());
                        p.setName(seed.name());
                        p.setEmail(seed.email());
                        p.setPhone(seed.phone());
                        p.setPassword(passwordEncoder.encode(seed.rawPassword()));
                        p.setType(UserType.PATIENT);
                        p.setActive(Boolean.TRUE);
                        return p;
                    });

            if (patient.getActive() == null) {
                patient.setActive(Boolean.TRUE);
            }
            patient.setBirthdate(seed.birthdate());
            patient.setGender(seed.gender());
            patient.setAddress(seed.address());
            patient.setPhone(seed.phone());

            patient.getDoctors().clear();
            for (String doctorEmail : seed.doctorEmails()) {
                Doctor doctor = requireValue(doctorByEmail, doctorEmail, "Missing doctor for email ");
                patient.getDoctors().add(doctor);
                doctor.getPatients().add(patient);
            }

            patient.getCaregivers().clear();
            for (String caregiverEmail : seed.caregiverEmails()) {
                Caregiver caregiver = requireValue(caregiverByEmail, caregiverEmail, "Missing caregiver for email ");
                patient.getCaregivers().add(caregiver);
                caregiver.getPatients().add(patient);
            }

            result.add(patientRepository.save(patient));
        }

        doctorRepository.saveAll(doctors);
        caregiverRepository.saveAll(caregivers);
        return result;
    }

    private List<Exam> seedExams(List<Doctor> doctors, List<Patient> patients) {
        if (examRepository.count() > 0) {
            List<Exam> existing = examRepository.findAll();
            List<Exam> toUpdate = existing.stream()
                    .filter(exam -> exam.getActive() == null)
                    .toList();
            if (!toUpdate.isEmpty()) {
                toUpdate.forEach(exam -> exam.setActive(Boolean.TRUE));
                examRepository.saveAll(toUpdate);
            }
            return existing;
        }

        Map<String, Doctor> doctorByEmail = doctors.stream()
                .collect(Collectors.toMap(Doctor::getEmail, doctor -> doctor));
        Map<String, Patient> patientByEmail = patients.stream()
                .collect(Collectors.toMap(Patient::getEmail, patient -> patient));

        ExamType cognitive = getExamType(ExamTypeEnum.COGNITIVE_TEST);
        ExamType brainScan = getExamType(ExamTypeEnum.BRAIN_SCAN);
        ExamType memory = getExamType(ExamTypeEnum.MEMORY_TEST);

        ExamStatus scheduled = getExamStatus(ExamStatusType.SCHEDULED);
        ExamStatus completed = getExamStatus(ExamStatusType.COMPLETED);
        ExamStatus pendingResult = getExamStatus(ExamStatusType.PENDING_RESULT);

        List<Exam> exams = new ArrayList<>();

        Exam exam1 = new Exam();
        exam1.setActive(Boolean.TRUE);
        exam1.setDoctor(requireValue(doctorByEmail, "ana.sousa@alzcare.com", "Missing doctor for email "));
        exam1.setPatient(requireValue(patientByEmail, "maria.silva@alzcare.com", "Missing patient for email "));
        exam1.setType(cognitive);
        exam1.setStatus(scheduled);
        exam1.setRequestDate(LocalDateTime.now().plusDays(7));
        exam1.setInstructions("Patient should avoid caffeine for 12 hours and rest well the night before.");
        exam1.setNote("Caregiver will accompany and monitor blood pressure.");
        exams.add(exam1);

        Exam exam2 = new Exam();
        exam2.setActive(Boolean.TRUE);
        exam2.setDoctor(requireValue(doctorByEmail, "bruno.azevedo@alzcare.com", "Missing doctor for email "));
        exam2.setPatient(requireValue(patientByEmail, "marcos.souza@alzcare.com", "Missing patient for email "));
        exam2.setType(brainScan);
        exam2.setStatus(completed);
        exam2.setRequestDate(LocalDateTime.now().minusDays(20));
        exam2.setInstructions("Bring previous imaging results and arrive 30 minutes early.");
        exam2.setNote("Observed recurring headaches and instability while walking.");
        exam2.setUpdatedAt(LocalDateTime.now().minusDays(3));
        exam2.setUpdatedBy(exam2.getDoctor().getId());
        exams.add(exam2);

        Exam exam3 = new Exam();
        exam3.setActive(Boolean.TRUE);
        exam3.setDoctor(requireValue(doctorByEmail, "ana.sousa@alzcare.com", "Missing doctor for email "));
        exam3.setPatient(requireValue(patientByEmail, "marina.melo@alzcare.com", "Missing patient for email "));
        exam3.setType(memory);
        exam3.setStatus(pendingResult);
        exam3.setRequestDate(LocalDateTime.now().minusDays(5));
        exam3.setInstructions("Apply episodic recall protocol and compare with last evaluation.");
        exam3.setNote("Pending feedback from caregiver about daily routine adjustments.");
        exams.add(exam3);

        List<Exam> saved = new ArrayList<>();
        examRepository.saveAll(exams).forEach(saved::add);
        return saved;
    }

    private void seedExamResults(List<Exam> exams) {
        if (examResultRepository.count() > 0 || exams.isEmpty()) {
            return;
        }

        exams.stream()
                .filter(exam -> ExamStatusType.COMPLETED.getId().equals(exam.getStatus().getId()))
                .findFirst()
                .ifPresent(exam -> {
                    File file = File.builder()
                            .name("brain_scan_result_" + exam.getId() + ".pdf")
                            .extension("pdf")
                            .randomName(UUID.randomUUID().toString())
                            .size(524288L)
                            .creationDate(LocalDateTime.now().minusDays(2))
                            .addedBy(exam.getDoctor())
                            .mimeType("application/pdf")
                            .filePath("/files/exams/" + exam.getId())
                            .isActive(true)
                            .build();

                    File storedFile = fileRepository.save(file);

                    ExamResult result = ExamResult.builder()
                            .exam(exam)
                            .file(storedFile)
                            .isActive(true)
                            .build();

                    examResultRepository.save(result);
                });
    }

    private List<AssociationRequest> seedAssociationRequests(List<Patient> patients, List<Doctor> doctors, List<Caregiver> caregivers, Administrator admin) {
        Map<String, Patient> patientByEmail = patients.stream()
                .collect(Collectors.toMap(Patient::getEmail, patient -> patient));
        Map<String, Doctor> doctorByEmail = doctors.stream()
                .collect(Collectors.toMap(Doctor::getEmail, doctor -> doctor));
        Map<String, Caregiver> caregiverByEmail = caregivers.stream()
                .collect(Collectors.toMap(Caregiver::getEmail, caregiver -> caregiver));

        List<AssociationRequest> existingRequests = associationRequestRepository.findAll();
        Map<String, AssociationRequest> requestByKey = existingRequests.stream()
                .collect(Collectors.toMap(
                        request -> associationKey(request.getPatient(), request.getRelation(), request.getType()),
                        request -> request,
                        (left, right) -> left));

        List<AssociationRequest> toPersist = new ArrayList<>();

        Patient maria = requireValue(patientByEmail, "maria.silva@alzcare.com", "Missing patient for email ");
        Doctor ana = requireValue(doctorByEmail, "ana.sousa@alzcare.com", "Missing doctor for email ");
        AssociationRequest request1 = ensureAssociationRequest(requestByKey, toPersist, maria, ana, RequestType.PATIENT_TO_DOCTOR);
        request1.setPatient(maria);
        request1.setRelation(ana);
        request1.setType(RequestType.PATIENT_TO_DOCTOR);
        request1.setStatus(RequestStatus.ACEITA);
        request1.setCreatedAt(LocalDateTime.now().minusDays(40));
        request1.setRespondedAt(LocalDateTime.now().minusDays(37));
        request1.setCreator(maria);
        request1.setResponder(ana);

        Patient marcos = requireValue(patientByEmail, "marcos.souza@alzcare.com", "Missing patient for email ");
        Doctor bruno = requireValue(doctorByEmail, "bruno.azevedo@alzcare.com", "Missing doctor for email ");
        AssociationRequest request2 = ensureAssociationRequest(requestByKey, toPersist, marcos, bruno, RequestType.DOCTOR_TO_PATIENT);
        request2.setPatient(marcos);
        request2.setRelation(bruno);
        request2.setType(RequestType.DOCTOR_TO_PATIENT);
        request2.setStatus(RequestStatus.PENDENTE);
        request2.setCreatedAt(LocalDateTime.now().minusDays(12));
        request2.setCreator(bruno);
        request2.setRespondedAt(null);
        request2.setResponder(null);

        Patient marina = requireValue(patientByEmail, "marina.melo@alzcare.com", "Missing patient for email ");
        Caregiver amanda = requireValue(caregiverByEmail, "amanda.dias@alzcare.com", "Missing caregiver for email ");
        AssociationRequest request3 = ensureAssociationRequest(requestByKey, toPersist, marina, amanda, RequestType.PATIENT_TO_CAREGIVER);
        request3.setPatient(marina);
        request3.setRelation(amanda);
        request3.setType(RequestType.PATIENT_TO_CAREGIVER);
        request3.setStatus(RequestStatus.ACEITA);
        request3.setCreatedAt(LocalDateTime.now().minusDays(18));
        request3.setRespondedAt(LocalDateTime.now().minusDays(16));
        request3.setCreator(marina);
        request3.setResponder(admin);

        Caregiver rita = requireValue(caregiverByEmail, "rita.campos@alzcare.com", "Missing caregiver for email ");

        AssociationRequest request4 = ensureAssociationRequest(requestByKey, toPersist, maria, amanda, RequestType.CAREGIVER_TO_PATIENT);
        request4.setPatient(maria);
        request4.setRelation(amanda);
        request4.setType(RequestType.CAREGIVER_TO_PATIENT);
        request4.setStatus(RequestStatus.ACEITA);
        request4.setCreatedAt(LocalDateTime.now().minusDays(30));
        request4.setRespondedAt(LocalDateTime.now().minusDays(28));
        request4.setCreator(amanda);
        request4.setResponder(maria);

        AssociationRequest request5 = ensureAssociationRequest(requestByKey, toPersist, marcos, rita, RequestType.CAREGIVER_TO_PATIENT);
        request5.setPatient(marcos);
        request5.setRelation(rita);
        request5.setType(RequestType.CAREGIVER_TO_PATIENT);
        request5.setStatus(RequestStatus.ACEITA);
        request5.setCreatedAt(LocalDateTime.now().minusDays(24));
        request5.setRespondedAt(LocalDateTime.now().minusDays(23));
        request5.setCreator(rita);
        request5.setResponder(admin);

        AssociationRequest request6 = ensureAssociationRequest(requestByKey, toPersist, marina, bruno, RequestType.PATIENT_TO_DOCTOR);
        request6.setPatient(marina);
        request6.setRelation(bruno);
        request6.setType(RequestType.PATIENT_TO_DOCTOR);
        request6.setStatus(RequestStatus.RECUSADA);
        request6.setCreatedAt(LocalDateTime.now().minusDays(14));
        request6.setRespondedAt(LocalDateTime.now().minusDays(13));
        request6.setCreator(marina);
        request6.setResponder(bruno);

        AssociationRequest request7 = ensureAssociationRequest(requestByKey, toPersist, marcos, ana, RequestType.DOCTOR_TO_PATIENT);
        request7.setPatient(marcos);
        request7.setRelation(ana);
        request7.setType(RequestType.DOCTOR_TO_PATIENT);
        request7.setStatus(RequestStatus.ACEITA);
        request7.setCreatedAt(LocalDateTime.now().minusDays(8));
        request7.setRespondedAt(LocalDateTime.now().minusDays(7));
        request7.setCreator(ana);
        request7.setResponder(marcos);

        if (!toPersist.isEmpty()) {
            associationRequestRepository.saveAll(toPersist);
        }
        return associationRequestRepository.findAll();
    }

    private void seedNotifications(
            Administrator admin,
            List<Doctor> doctors,
            List<Caregiver> caregivers,
            List<Patient> patients,
            List<Exam> exams,
            List<AssociationRequest> requests) {

        List<Notification> existingNotifications = notificationRepository.findAll();

        Notification welcome = existingNotifications.stream()
                .filter(notification -> NotificationType.RELATIONAL_UPDATE.equals(notification.getType()))
                .filter(notification -> "Demo data ready".equals(notification.getTitle()))
                .findFirst()
                .orElse(null);

        if (welcome == null) {
            welcome = new Notification();
            welcome.setType(NotificationType.RELATIONAL_UPDATE);
            welcome.setTitle("Demo data ready");
            welcome.setMessage("We prepared demo users, relationships and exams so you can explore the workflow.");
            welcome.setSender(admin);
            welcome.setCreatedAt(LocalDateTime.now().minusDays(10));
            welcome = notificationRepository.save(welcome);
        }

        List<User> recipients = new ArrayList<>();
        recipients.addAll(doctors);
        recipients.addAll(caregivers);
        recipients.addAll(patients);

        Set<Long> existingWelcomeRecipients = welcome.getRecipients().stream()
                .map(NotificationRecipient::getRecipient)
                .filter(recipient -> recipient != null && recipient.getId() != null)
                .map(User::getId)
                .collect(Collectors.toSet());

        boolean welcomeRecipientsAdded = false;
        for (User recipient : recipients) {
            if (recipient.getId() == null || existingWelcomeRecipients.contains(recipient.getId())) {
                continue;
            }
            NotificationRecipient link = new NotificationRecipient(welcome, recipient);
            welcome.addRecipient(link);
            recipient.getReceived().add(link);
            welcomeRecipientsAdded = true;
        }
        if (welcomeRecipientsAdded) {
            notificationRepository.save(welcome);
        }

        Map<Long, Boolean> notificationByAssociation = existingNotifications.stream()
                .filter(notification -> notification.getAssociation() != null && notification.getAssociation().getId() != null)
                .collect(Collectors.toMap(
                        notification -> notification.getAssociation().getId(),
                        notification -> Boolean.TRUE,
                        (left, right) -> left));

        exams.stream()
                .filter(exam -> ExamStatusType.SCHEDULED.getId().equals(exam.getStatus().getId()))
                .findFirst()
                .ifPresent(exam -> {
                    Notification examReminder = new Notification();
                    examReminder.setType(NotificationType.EXAM_REMINDER);
                    examReminder.setTitle("Upcoming exam for " + exam.getPatient().getName());
                    examReminder.setMessage("Exam " + exam.getType().getDescription()
                            + " scheduled for " + DATE_FORMATTER.format(exam.getRequestDate().toLocalDate())
                            + ". Please arrive 15 minutes earlier.");
                    examReminder.setSender(exam.getDoctor());
                    examReminder.setExam(exam);
                    examReminder.setCreatedAt(LocalDateTime.now().minusDays(2));
                    notificationRepository.save(examReminder);

                    NotificationRecipient patientRecipient = new NotificationRecipient(examReminder, exam.getPatient());
                    examReminder.addRecipient(patientRecipient);
                    exam.getPatient().getReceived().add(patientRecipient);

                    exam.getPatient().getCaregivers().forEach(caregiver -> {
                        NotificationRecipient caregiverRecipient = new NotificationRecipient(examReminder, caregiver);
                        examReminder.addRecipient(caregiverRecipient);
                        caregiver.getReceived().add(caregiverRecipient);
                    });

                    notificationRepository.save(examReminder);
                });

        Set<Long> processedNotificationAssociationIds = new HashSet<>(notificationByAssociation.keySet());

        requests.stream()
                .filter(request -> request.getStatus() == RequestStatus.ACEITA)
                .filter(request -> request.getId() != null)
                .filter(request -> processedNotificationAssociationIds.add(request.getId()))
                .forEach(request -> {
                    Notification relationNotice = new Notification();
                    relationNotice.setType(NotificationType.RELATIONAL_UPDATE);
                    relationNotice.setTitle("Association confirmed with " + request.getRelation().getName());

                    String relationRole = request.getRelation().getType() == UserType.DOCTOR ? "doctor" : "caregiver";
                    relationNotice.setMessage("The " + relationRole + " association between "
                            + request.getPatient().getName()
                            + " and "
                            + request.getRelation().getName()
                            + " is active. Caregivers were notified to coordinate the care plan.");

                    relationNotice.setSender(request.getResponder() != null ? request.getResponder() : admin);
                    relationNotice.setAssociation(request);

                    LocalDateTime baseCreatedAt = request.getRespondedAt() != null
                            ? request.getRespondedAt().plusHours(1)
                            : request.getCreatedAt().plusHours(2);
                    relationNotice.setCreatedAt(baseCreatedAt);
                    relationNotice = notificationRepository.save(relationNotice);

                    Set<Long> processedRecipients = new HashSet<>();
                    List<User> associationRecipients = new ArrayList<>();
                    associationRecipients.add(request.getPatient());
                    associationRecipients.add(request.getRelation());
                    associationRecipients.addAll(request.getPatient().getCaregivers());

                    for (User recipient : associationRecipients) {
                        if (recipient == null || recipient.getId() == null || !processedRecipients.add(recipient.getId())) {
                            continue;
                        }
                        NotificationRecipient link = new NotificationRecipient(relationNotice, recipient);
                        relationNotice.addRecipient(link);
                        recipient.getReceived().add(link);
                    }

                    notificationRepository.save(relationNotice);
                });
    }

    private AssociationRequest ensureAssociationRequest(Map<String, AssociationRequest> requestByKey, List<AssociationRequest> accumulator,
            Patient patient, User relation, RequestType type) {
        String key = associationKey(patient, relation, type);
        AssociationRequest request = requestByKey.get(key);
        if (request == null) {
            request = new AssociationRequest();
            requestByKey.put(key, request);
        }
        if (!accumulator.contains(request)) {
            accumulator.add(request);
        }
        return request;
    }

    private String associationKey(Patient patient, User relation, RequestType type) {
        String patientEmail = patient != null ? patient.getEmail() : "UNKNOWN_PATIENT";
        String relationEmail = relation != null ? relation.getEmail() : "UNKNOWN_RELATION";
        String typeValue = type != null ? type.name() : "UNKNOWN_TYPE";
        return patientEmail + "|" + relationEmail + "|" + typeValue;
    }

    private void clearSeededData() {
        notificationRepository.deleteAll();
        associationRequestRepository.deleteAll();
        examResultRepository.deleteAll();
        fileRepository.deleteAll();
        examRepository.deleteAll();
    }

    private void seedIndicatorTypes() {
    System.out.println(">>> Seeding Indicator Types...");

    for (IndicatorTypeEnum enumVal : IndicatorTypeEnum.values()) {

        if (!indicatorTypeRepository.existsById(enumVal.getId())) {

            IndicatorType entity = new IndicatorType();

            entity.setId(enumVal.getId());
            entity.setDescription(enumVal.getDescription());

            indicatorTypeRepository.save(entity);
        }
    }
}

    private ExamType getExamType(ExamTypeEnum type) {
        return examTypeRepository.findById(type.getId())
                .orElseThrow(() -> new IllegalStateException("Exam type not found: " + type.getId()));
    }

    private ExamStatus getExamStatus(ExamStatusType status) {
        return examStatusRepository.findById(status.getId())
                .orElseThrow(() -> new IllegalStateException("Exam status not found: " + status.getId()));
    }

    private static <T> T requireValue(Map<String, T> source, String key, String messagePrefix) {
        T value = source.get(key);
        if (value == null) {
            throw new IllegalStateException(messagePrefix + key);
        }
        return value;
    }

    private record DoctorSeed(String name, String email, String cpf, String phone, String crm, String speciality, String rawPassword) {
    }

    private record CaregiverSeed(String name, String email, String cpf, String phone, String rawPassword, LocalDate birthdate, String gender, String address) {
    }

    private record PatientSeed(String name, String email, String cpf, String phone, String rawPassword, LocalDate birthdate, String gender, String address, List<String> doctorEmails, List<String> caregiverEmails) {
    }
    
}






