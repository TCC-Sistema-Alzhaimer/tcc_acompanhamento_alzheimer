import type { Administrator, Caregiver, Chat, ChatMessage, ChatUser, Doctor, DoctorPatient, Exam, ExamFile, Conclusion, Gender, MedicalHistory, Patient, User, UserType } from "~/types/Users"

export const userTypes: UserType[] = [
  { id: 1, type: "Administrator", description: "Administrador do sistema" },
  { id: 2, type: "Patient",       description: "Paciente" },
  { id: 3, type: "Caregiver",     description: "Cuidador" },
  { id: 4, type: "Doctor",        description: "Médico" },
]

export const genders: Gender[] = [
  { id: 1, type: "Male" },
  { id: 2, type: "Female" },
  { id: 3, type: "Other" },
]

export const users: User[] = [
  {
    id: 1,
    name: "Alice Admin",
    email: "alice.admin@example.com",
    password: "hashedpwd1",
    phone: "+55119990001",
    user_type_id: 1,
    created_at: "2025-06-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Bob Patient",
    email: "bob.patient@example.com",
    password: "hashedpwd2",
    phone: "+55119990002",
    user_type_id: 2,
    created_at: "2025-06-10T14:30:00Z",
  },
  {
    id: 3,
    name: "Carol Caregiver",
    email: "carol.caregiver@example.com",
    user_type_id: 3,
    created_at: "2025-06-11T09:15:00Z",
  },
  {
    id: 4,
    name: "Dr. David",
    email: "david.doctor@example.com",
    user_type_id: 4,
    created_at: "2025-06-12T08:45:00Z",
    password: "hashedpwd4",
  },
  {
    id: 5,
    name: "Eve Patient",
    email: "eve.patient@example.com",
    password: "hashedpwd5",
    phone: "+55119990003",
    user_type_id: 2,
    created_at: "2025-06-15T10:20:00Z",
  },
  {
    id: 6,
    name: "Frank Patient",
    email: "frank.patient@example.com",
    password: "hashedpwd6",
    phone: "+55119990004",
    user_type_id: 2,
    created_at: "2025-06-16T11:05:00Z",
  },
]

export const administrators: Administrator[] = [
  { id: 1, user_id: 1 },
]

export const patients: Patient[] = [
    {
        id: 1,
        user_id: 2,
        name: users.find(u => u.id === 2)!.name,
        email: users.find(u => u.id === 2)!.email,
        user_type_id: 2,
        created_at: users.find(u => u.id === 2)!.created_at,
        birthdate: "1990-05-20",
        address: "Rua A, 100, São Paulo - SP",
    },
    {
        id: 2,
        user_id: 5,
        name: users.find((u) => u.id === 5)!.name,
        email: users.find((u) => u.id === 5)!.email,
        user_type_id: 2,
        created_at: users.find((u) => u.id === 5)!.created_at,
        birthdate: "1988-12-01",
        address: "Rua C, 300, Rio de Janeiro - RJ",
    },
    {
        id: 3,
        user_id: 6,
        name: users.find((u) => u.id === 6)!.name,
        email: users.find((u) => u.id === 6)!.email,
        user_type_id: 2,
        created_at: users.find((u) => u.id === 6)!.created_at,
        birthdate: "1975-07-30",
        address: "Rua D, 400, Belo Horizonte - MG",
    },
]

export const caregivers: Caregiver[] = [
  {
    id: 3,
    name: users.find(u => u.id === 3)!.name,
    email: users.find(u => u.id === 3)!.email,
    user_type_id: 3,
    created_at: users.find(u => u.id === 3)!.created_at,
    patient_id: 1,
    birthdate: "1985-08-15",
    address: "Rua B, 200, São Paulo - SP",
  },
]

export const doctors: Doctor[] = [
  {
    id: 4,
    name: users.find(u => u.id === 4)!.name,
    email: users.find(u => u.id === 4)!.email,
    user_type_id: 4,
    created_at: users.find(u => u.id === 4)!.created_at,
    crm: "CRM12345",
    specialty: "Cardiology",
  },
]

export const doctorPatients: DoctorPatient[] = [
  { doctor_id: 4, patient_id: 1 },
]

export const medicalHistories: MedicalHistory[] = [
  {
    id: 1,
    patient_id: 1,
    description: "Hipertensão controlada com medicação",
    date: "2025-06-15T10:00:00Z",
  },
  {
    id: 2,
    patient_id: 1,
    description: "Alergia a penicilina",
    date: "2020-03-10T00:00:00Z",
  },
]

export const exams: Exam[] = [
  {
    id: 1,
    patient_id: 1,
    title: "Exame de Sangue",
    description: "Hemograma completo",
    instructions: "Jejum de 8 horas",
    date: "2025-06-16T08:00:00Z",
    status: "completed",
  },
  {
    id: 2,
    patient_id: 1,
    title: "Raio-X Torácico",
    date: "2025-06-18T11:30:00Z",
    status: "pending",
  },
]

export const conclusions: Conclusion[] = [
  {
    id: 1,
    exam_id: 1,
    patient_id: 1,
    doctor_id: 4,
    description: "Exame de sangue realizado com sucesso.",
    conclusion: "Exame normal, sem alterações significativas.",
    date: "2025-06-17T10:00:00Z",
  },
]

export const examFiles: ExamFile[] = [
  { id: 1, exam_id: 1, file_path: "/files/exams/blood-test.pdf" },
  { id: 2, exam_id: 2, file_path: "/files/exams/chest-xray.jpg" },
]

export const chats: Chat[] = [
  { id: 1, name: "Consultation Chat", created_at: "2025-06-20T09:00:00Z" },
]

export const chatUsers: ChatUser[] = [
  { chat_id: 1, user_id: 2 },
  { chat_id: 1, user_id: 4 },
]

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    chat_id: 1,
    sender_id: 2,
    receiver_id: 4,
    message: "Olá doutor, tenho uma dúvida sobre meu exame.",
    created_at: "2025-06-20T09:05:00Z",
  },
  {
    id: 2,
    chat_id: 1,
    sender_id: 4,
    receiver_id: 2,
    message: "Olá Bob, claro. Pode descrever melhor?",
    created_at: "2025-06-20T09:06:00Z",
  },
]