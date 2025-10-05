import { ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { ExamMock } from "@/mocks/exam-mocks";
import { fetchExamById } from "@/services/exam-service";
import { Exam } from "@/types/domain/exam";

type LocalParams = { id?: string };

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<LocalParams>();
  const session = useSession();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const findFallbackExam = (): Exam | null => {
      if (!id) {
        return null;
      }
      const fallback = ExamMock.find((item) => String(item.id) === String(id));
      return fallback ?? null;
    };

    const loadExam = async () => {
      if (!id) {
        if (active) {
          setExam(null);
        }
        return;
      }

      if (!session?.accessToken) {
        if (active) {
          setExam(findFallbackExam());
        }
        return;
      }

      if (active) {
        setLoading(true);
      }

      try {
        const data = await fetchExamById({
          accessToken: session.accessToken,
          examId: String(id),
        });

        if (active) {
          setExam(data);
        }
      } catch (error) {
        console.error("Erro ao carregar exame:", error);
        if (active) {
          setExam(findFallbackExam());
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadExam();

    return () => {
      active = false;
    };
  }, [id, session?.accessToken]);

  const requestDate = exam?.requestDate
    ? new Date(exam.requestDate).toLocaleDateString()
    : "-";

  return (
    <ThemedView style={styles.container} type="default">
      {loading ? (
        <ActivityIndicator />
      ) : exam ? (
        <ThemedView style={styles.content} type="secondary">
          <ThemedText>Solicitado em: {requestDate}</ThemedText>
          <ThemedText>Status: {exam.examStatusDescription ?? "-"}</ThemedText>
          <ThemedText>Tipo: {exam.examTypeDescription ?? "-"}</ThemedText>
          {exam.instructions ? (
            <ThemedText>Instrucoes: {exam.instructions}</ThemedText>
          ) : null}
          {exam.result ? (
            <ThemedText>Resultado: {exam.result}</ThemedText>
          ) : null}
          {exam.note ? (
            <ThemedText>Anotacoes: {exam.note}</ThemedText>
          ) : null}
          {exam.updatedAt ? (
            <ThemedText>
              Atualizado em: {new Date(exam.updatedAt).toLocaleString()}
            </ThemedText>
          ) : null}
        </ThemedView>
      ) : (
        <ThemedText>Nenhum exame encontrado.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: {
    gap: 12,
    alignContent: "center",
    padding: 16,
  },
});
