export type Doctor = {
  id: string;
  name: string;
  role: string;
  featured?: boolean;
};

export const DoctorMocks: Doctor[] = [
  { id: "1", name: "Dr. Carlos", role: "Médico", featured: true },
  { id: "2", name: "Dr. André", role: "Médico" },
  { id: "3", name: "Dra. Mariana", role: "Pediatra" },
  { id: "4", name: "Dr. Felipe", role: "Cardiologista" },
  { id: "5", name: "Dra. Beatriz", role: "Dermatologista" },
  { id: "6", name: "Dr. Rafael", role: "Ortopedista" },
  { id: "7", name: "Dra. Ana Paula", role: "Ginecologista" },
  { id: "8", name: "Dr. João", role: "Clínico Geral" },
  { id: "9", name: "Dra. Camila", role: "Nutricionista" },
  { id: "10", name: "Dr. Pedro", role: "Fisioterapeuta" },
  { id: "11", name: "Dra. Luiza", role: "Psicóloga" },
  { id: "12", name: "Dr. Marcelo", role: "Urologista" },
];
