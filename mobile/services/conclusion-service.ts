import { ConclusionResponse } from "@/types/api/conclusion";
import { api } from "./api";
import { ROUTES } from "./routes";

interface AuthenticatedRequest {
  accessToken: string;
}

export async function fetchConclusionById({
  accessToken,
  conclusionId,
}: AuthenticatedRequest & {
  conclusionId: string;
}): Promise<ConclusionResponse> {
  const response = await api.get<ConclusionResponse>(
    ROUTES.CONCLUSION_BY_ID(conclusionId),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

export async function fetchConclusionsByExamId({
  accessToken,
  examId,
}: AuthenticatedRequest & { examId: string }): Promise<ConclusionResponse[]> {
  const response = await api.get<ConclusionResponse[]>(
    ROUTES.CONCLUSIONS_BY_EXAM_ID(examId),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
