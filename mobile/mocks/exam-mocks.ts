import { Exam, ExamStatus, ExamType } from "@/types/domain/exam";

const STATUS_DESCRIPTIONS: Record<ExamStatus, string> = {
  [ExamStatus.PENDING]: "Pendente",
  [ExamStatus.COMPLETED]: "Realizado",
  [ExamStatus.CANCELED]: "Cancelado",
};

const TYPE_DESCRIPTIONS: Record<ExamType, string> = {
  [ExamType.BLOOD_TEST]: "Hemograma completo",
  [ExamType.URINE_TEST]: "Urina tipo I",
  [ExamType.BRAIN_SCAN]: "Ressonancia magnetica",
  [ExamType.COGNITIVE_ASSESSMENT]: "Avaliacao cognitiva",
  [ExamType.OTHER]: "Outro exame",
};

function buildExam(
  exam: Omit<Exam, "examTypeDescription" | "examStatusDescription"> & {
    examTypeId: ExamType;
    examStatusId: ExamStatus;
    examTypeDescription?: string;
    examStatusDescription?: string;
  }
): Exam {
  return {
    ...exam,
    examTypeDescription:
      exam.examTypeDescription ?? TYPE_DESCRIPTIONS[exam.examTypeId],
    examStatusDescription:
      exam.examStatusDescription ?? STATUS_DESCRIPTIONS[exam.examStatusId],
  };
}

export const ExamMock: Exam[] = [
  buildExam({
    id: "exa_0001",
    doctorId: "doc_102",
    patientId: "pat_501",
    examTypeId: ExamType.BLOOD_TEST,
    examStatusId: ExamStatus.PENDING,
    requestDate: "2025-09-10T09:15:00Z",
    instructions: "Jejum de 8 horas.",
    note: "Solicitado devido a fadiga persistente.",
    updatedAt: "2025-09-10T09:16:00Z",
    updatedBy: "doc_102",
  }),
  buildExam({
    id: "exa_0002",
    doctorId: "doc_104",
    patientId: "pat_502",
    examTypeId: ExamType.BRAIN_SCAN,
    examStatusId: ExamStatus.COMPLETED,
    requestDate: "2025-08-29T14:00:00Z",
    result: "Sem alteracoes significativas.",
    note: "Tosse ha duas semanas.",
    updatedAt: "2025-08-30T11:30:00Z",
    updatedBy: "lab_01",
  }),
  buildExam({
    id: "exa_0003",
    doctorId: "doc_103",
    patientId: "pat_503",
    examTypeId: ExamType.COGNITIVE_ASSESSMENT,
    examStatusId: ExamStatus.PENDING,
    requestDate: "2025-09-15T12:40:00Z",
    instructions: "Chegar 30 minutos antes.",
    note: "Dor lombar cronica.",
  }),
  buildExam({
    id: "exa_0004",
    doctorId: "doc_101",
    patientId: "pat_504",
    examTypeId: ExamType.OTHER,
    examStatusId: ExamStatus.COMPLETED,
    requestDate: "2025-07-11T08:05:00Z",
    result: "Ritmo sinusal normal.",
    note: "Check-up anual.",
    updatedAt: "2025-07-11T10:22:00Z",
    updatedBy: "lab_02",
  }),
  buildExam({
    id: "exa_0005",
    doctorId: "doc_105",
    patientId: "pat_505",
    examTypeId: ExamType.URINE_TEST,
    examStatusId: ExamStatus.PENDING,
    requestDate: "2025-09-17T13:20:00Z",
    instructions: "Coletar amostra matinal.",
    note: "Avaliacao pre-operatoria.",
  }),
  buildExam({
    id: "exa_0006",
    doctorId: "doc_102",
    patientId: "pat_506",
    examTypeId: ExamType.BLOOD_TEST,
    examStatusId: ExamStatus.COMPLETED,
    requestDate: "2025-06-21T10:00:00Z",
    result: "Hemoglobina 14.2 g/dL; leucocitos dentro da faixa.",
    note: "Retorno pos-tratamento.",
    updatedAt: "2025-06-21T12:10:00Z",
    updatedBy: "lab_03",
  }),
];

const EXAM_TYPE_OPTIONS: ExamType[] = [
  ExamType.BLOOD_TEST,
  ExamType.URINE_TEST,
  ExamType.BRAIN_SCAN,
  ExamType.COGNITIVE_ASSESSMENT,
  ExamType.OTHER,
];

const STATUS_OPTIONS: ExamStatus[] = [
  ExamStatus.PENDING,
  ExamStatus.COMPLETED,
];

export function generateExams(count = 10): Exam[] {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n: number) => n.toString().padStart(4, "0");

  return Array.from({ length: count }, (_, index) => {
    const examTypeId = pick(EXAM_TYPE_OPTIONS);
    const examStatusId = pick(STATUS_OPTIONS);
    const id = `exa_${pad(1000 + index + 1)}`;

    const exam = buildExam({
      id,
      doctorId: `doc_${100 + ((index + 1) % 7)}`,
      patientId: `pat_${500 + index + 1}`,
      examTypeId,
      examStatusId,
      requestDate: new Date(
        Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000
      ).toISOString(),
      note:
        examStatusId === ExamStatus.COMPLETED
          ? "Exame concluido e revisado."
          : "Aguardando agendamento ou execucao.",
    });

    if (examStatusId === ExamStatus.COMPLETED) {
      exam.result = "Resultado dentro dos limites de referencia.";
      exam.updatedAt = new Date().toISOString();
      exam.updatedBy = "lab_auto";
    } else {
      exam.instructions = "Seguir orientacoes do laboratorio.";
    }

    return exam;
  });
}
