import { useState, useEffect } from "react";
import {
  getPatientHistory,
  getPatientExams,
  getPatientConclusions,
  getPatientIndicators,
  type MedicalHistoryResponseDTO,
  type ExamResponseDTO,
  type ConclusionResponseDTO,
  type IndicatorResponseDTO,
} from "~/services/doctorService";

export type UnifiedHistoryItem =
  | (MedicalHistoryResponseDTO & { itemType: "HISTORY" })
  | (ExamResponseDTO & { itemType: "EXAM" })
  | (ConclusionResponseDTO & { itemType: "CONCLUSION" })
  | (IndicatorResponseDTO & { itemType: "INDICATOR" });

const getSortableDate = (item: UnifiedHistoryItem): Date => {
  if (item.itemType === "EXAM") return new Date(item.requestDate);
  if (item.itemType === "INDICATOR") return new Date(item.data);
  return new Date(item.createdAt);
};

export function usePatientHistory(patientId: number | null) {
  const [history, setHistory] = useState<UnifiedHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patientId === null) {
      setHistory([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [historyRes, examsRes, conclusionsRes, indicatorsRes] =
          await Promise.allSettled([
            getPatientHistory(patientId),
            getPatientExams(patientId),
            getPatientConclusions(patientId),
            getPatientIndicators(patientId),
          ]);

        const combinedList: UnifiedHistoryItem[] = [];

        if (historyRes.status === "fulfilled") {
          historyRes.value.forEach((item) =>
            combinedList.push({ ...item, itemType: "HISTORY" })
          );
        }
        if (examsRes.status === "fulfilled") {
          examsRes.value.forEach((item) =>
            combinedList.push({ ...item, itemType: "EXAM" })
          );
        }
        if (conclusionsRes.status === "fulfilled") {
          conclusionsRes.value.forEach((item) =>
            combinedList.push({ ...item, itemType: "CONCLUSION" })
          );
        }
        if (indicatorsRes.status === "fulfilled") {
          indicatorsRes.value.forEach((item) =>
            combinedList.push({ ...item, itemType: "INDICATOR" })
          );
        }

        combinedList.sort(
          (a, b) => getSortableDate(b).getTime() - getSortableDate(a).getTime()
        );

        setHistory(combinedList);
      } catch (error) {
        console.error("Erro ao combinar históricos:", error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { history, isLoading };
}
