export interface IndicatorResponse {
  id: number;
  valor: number;
  descricao: string;
  data: string;
  tipoDescription: string;
  tipoId: number;
  patientId: number;
  patientName: string;
  fileId: number | null;
  conclusionId: number | null;
}
