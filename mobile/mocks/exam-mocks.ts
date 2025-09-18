import { Exam, ExamStatus, ExamType } from "@/types/domain/exam";

export const EXAM_STATUSES: Record<"pendente" | "realizado", ExamStatus> = {
  pendente: { id: "pending", description: "Pendente" },
  realizado: { id: "done", description: "Realizado" },
};

// ---- Tipos de exame (exemplos) ----
export const EXAM_TYPES: ExamType[] = [
  { id: "blood", description: "Hemograma completo" },
  { id: "xray", description: "Raio-X de tórax" },
  { id: "mri", description: "Ressonância magnética" },
  { id: "urine", description: "Urina tipo I" },
  { id: "ecg", description: "Eletrocardiograma (ECG)" },
];

// ---- Mocks prontos ----
export const ExamMock: Exam[] = [
  {
    id: "exa_0001",
    doctorId: "doc_102",
    patientId: "pat_501",
    type: EXAM_TYPES[0],
    status: EXAM_STATUSES.pendente,
    requestDate: "2025-09-10T09:15:00Z",
    intructions: "Jejum de 8 horas.",
    note: "Solicitado devido a fadiga persistente.",
    updatedAt: "2025-09-10T09:16:00Z",
    updatedBy: "doc_102",
  },
  {
    id: "exa_0002",
    doctorId: "doc_104",
    patientId: "pat_502",
    type: EXAM_TYPES[1],
    status: EXAM_STATUSES.realizado,
    requestDate: "2025-08-29T14:00:00Z",
    result: "Sem alterações significativas.",
    note: "Tosse há 2 semanas.",
    updatedAt: "2025-08-30T11:30:00Z",
    updatedBy: "lab_01",
  },
  {
    id: "exa_0003",
    doctorId: "doc_103",
    patientId: "pat_503",
    type: EXAM_TYPES[2],
    status: EXAM_STATUSES.pendente,
    requestDate: "2025-09-15T12:40:00Z",
    intructions: "Remover objetos metálicos. Chegar 30 min antes.",
    note: "Dor lombar crônica.",
  },
  {
    id: "exa_0004",
    doctorId: "doc_101",
    patientId: "pat_504",
    type: EXAM_TYPES[4],
    status: EXAM_STATUSES.realizado,
    requestDate: "2025-07-11T08:05:00Z",
    result: "Ritmo sinusal normal.",
    note: "Check-up anual.",
    updatedAt: "2025-07-11T10:22:00Z",
    updatedBy: "lab_02",
  },
  {
    id: "exa_0005",
    doctorId: "doc_105",
    patientId: "pat_505",
    type: EXAM_TYPES[3],
    status: EXAM_STATUSES.pendente,
    requestDate: "2025-09-17T13:20:00Z",
    intructions: "Coletar amostra matinal.",
    note: "Avaliação pré-operatória.",
  },
  {
    id: "exa_0006",
    doctorId: "doc_102",
    patientId: "pat_506",
    type: EXAM_TYPES[0],
    status: EXAM_STATUSES.realizado,
    requestDate: "2025-06-21T10:00:00Z",
    result: "Hemoglobina 14.2 g/dL; leucócitos dentro da faixa.",
    note: "Retorno pós-tratamento.",
    updatedAt: "2025-06-21T12:10:00Z",
    updatedBy: "lab_03",
  },
];

// ---- Gerador opcional de mocks ----
// Use para criar mais itens rapidamente sem libs externas.
export function generateExams(count = 10): Exam[] {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n: number) => n.toString().padStart(4, "0");

  const exams: Exam[] = [];
  for (let i = 1; i <= count; i++) {
    const type = pick(EXAM_TYPES);
    const isDone = Math.random() < 0.5;
    const id = `exa_${pad(1000 + i)}`;

    const base: Exam = {
      id,
      doctorId: `doc_${100 + (i % 7)}`,
      patientId: `pat_${500 + i}`,
      type,
      status: isDone ? EXAM_STATUSES.realizado : EXAM_STATUSES.pendente,
      requestDate: new Date(
        Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000
      ).toISOString(),
      note: isDone
        ? "Exame concluído e revisado."
        : "Aguardando agendamento/execução.",
    };

    if (isDone) {
      base.result = "Resultado dentro dos limites de referência.";
      base.updatedAt = new Date().toISOString();
      base.updatedBy = "lab_auto";
    } else {
      base.intructions = "Seguir orientações do laboratório.";
    }

    exams.push(base);
  }
  return exams;
}
