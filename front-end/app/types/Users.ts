// Usuários
export interface User {
  id: number
  name: string
  email: string
  password?: string
  phone?: string
  user_type_id: number
  created_at: Date | string
}

export interface UserType {
  id: number
  type: string
  description?: string
}

export interface Gender {
  id: number
  type: string
  description?: string
}

export interface Patient extends User {
  user_id: number
  birthdate: Date | string
  address?: string
}

export interface Caregiver extends User {
  patient_id: number
  birthdate: Date | string
  address?: string
}

export interface Doctor extends User {
  crm: string
  specialty?: string
}

export interface DoctorPatient {
  doctor_id: number
  patient_id: number
}

export interface MedicalHistory {
  id: number
  patient_id: number
  description: string
  date: Date | string
}

export interface Exam {
  id: number
  patient_id: number
  title: string
  description?: string
  instructions?: string
  date: Date | string
  status?: string
}

export interface Conclusion {
  id: number
  doctor_id: number
  patient_id: number
  exam_id: number
  date: Date | string
  description: string
  title?: string
  conclusion: string
}

export interface ExamFile {
  id: number
  exam_id: number
  file_path: string
}

export interface Chat {
  id: number
  name?: string
  created_at: Date | string
}

export interface ChatUser {
  chat_id: number
  user_id: number
}

export interface ChatMessage {
  id: number
  chat_id: number
  sender_id: number
  receiver_id?: number
  message: string
  created_at: Date | string
}

export interface Notification {
  id: number
  sender_id: number
  receiver_id: number
  message: string
  date: Date | string
  read: boolean
}

export interface Administrator {
  id: number
  user_id: number
}
