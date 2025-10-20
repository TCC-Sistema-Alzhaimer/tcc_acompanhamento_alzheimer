interface PatientList {
  id: number;
  doctorId: number;
  name: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  phone: string;
  consulta: {
    id: number;
    date: Date;
    name: string;
    description: string;
    status: string;
  }[];
}

export const patientList: PatientList[] = [
  {
    id: 1,
    doctorId: 1,
    name: "Maria Silva Santos",
    dateOfBirth: new Date("1945-03-15"),
    gender: "Feminino",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    consulta: [
      {
        id: 101,
        date: new Date("2025-10-25"),
        name: "Consulta de Rotina",
        description: "Avaliação cognitiva mensal",
        status: "Agendada",
      },
      {
        id: 102,
        date: new Date("2025-09-20"),
        name: "Consulta de Acompanhamento",
        description: "Revisão de medicamentos e análise de progressão",
        status: "Concluída",
      },
    ],
  },
  {
    id: 2,
    doctorId: 1,
    name: "João Carlos Oliveira",
    dateOfBirth: new Date("1950-07-22"),
    gender: "Masculino",
    email: "joao.oliveira@email.com",
    phone: "(21) 99876-5432",
    consulta: [
      {
        id: 201,
        date: new Date("2025-10-28"),
        name: "Avaliação Neurológica",
        description: "Testes cognitivos e avaliação de memória",
        status: "Agendada",
      },
    ],
  },
  {
    id: 3,
    doctorId: 1,
    name: "Ana Paula Costa",
    dateOfBirth: new Date("1948-11-08"),
    gender: "Feminino",
    email: "ana.costa@email.com",
    phone: "(31) 97654-3210",
    consulta: [
      {
        id: 301,
        date: new Date("2025-10-22"),
        name: "Consulta Urgente",
        description: "Piora repentina dos sintomas",
        status: "Agendada",
      },
      {
        id: 302,
        date: new Date("2025-09-15"),
        name: "Consulta de Rotina",
        description: "Avaliação trimestral",
        status: "Concluída",
      },
      {
        id: 303,
        date: new Date("2025-06-10"),
        name: "Primeira Consulta",
        description: "Diagnóstico inicial",
        status: "Concluída",
      },
    ],
  },
  {
    id: 4,
    doctorId: 1,
    name: "Pedro Henrique Souza",
    dateOfBirth: new Date("1952-01-30"),
    gender: "Masculino",
    email: "pedro.souza@email.com",
    phone: "(41) 96543-2109",
    consulta: [
      {
        id: 401,
        date: new Date("2025-11-05"),
        name: "Consulta de Acompanhamento",
        description: "Monitoramento de tratamento",
        status: "Agendada",
      },
      {
        id: 402,
        date: new Date("2025-10-01"),
        name: "Ajuste de Medicação",
        description: "Revisão de dosagem e efeitos colaterais",
        status: "Concluída",
      },
    ],
  },
  {
    id: 5,
    doctorId: 1,
    name: "Rosa Maria Ferreira",
    dateOfBirth: new Date("1947-05-18"),
    gender: "Feminino",
    email: "rosa.ferreira@email.com",
    phone: "(51) 95432-1098",
    consulta: [],
  },
];
