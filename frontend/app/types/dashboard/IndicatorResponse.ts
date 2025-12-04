export interface IndicatorResponse {
  id: number;
  valor: number;
  descricao: string;
  data: string;
  tipoDescription: string;
  tipoId: string;
  patientId: number;
  patientName: string;
  fileId: number | null;
  conclusionId: number | null;
}
