import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { PreviewFile } from "@/components/files/PreviewFile";
import { InfoField } from "@/components/InfoField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import { fetchConclusionById } from "@/services/conclusion-service";
import { fetchExamById } from "@/services/exam-service";
import { ConclusionResponse } from "@/types/api/conclusion";
import { Exam } from "@/types/domain/exam";

type LocalParams = {
  id?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

function normalizeConclusion(
  conclusion: ConclusionResponse
): ConclusionResponse {
  return {
    ...conclusion,
    id: conclusion.id != null ? String(conclusion.id) : "",
    examId: conclusion.examId != null ? String(conclusion.examId) : "",
    doctorId: conclusion.doctorId != null ? String(conclusion.doctorId) : "",
    createdAt: conclusion.createdAt ?? "",
    updatedAt: conclusion.updatedAt ?? undefined,
    updatedBy:
      conclusion.updatedBy !== undefined && conclusion.updatedBy !== null
        ? String(conclusion.updatedBy)
        : undefined,
    files: conclusion.files ?? [],
  };
}

export default function ConclusionDetailScreen() {
  const { id } = useLocalSearchParams<LocalParams>();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [conclusion, setConclusion] = useState<ConclusionResponse | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadConclusion = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!id) {
        setError("Conclusao nao encontrada.");
        setConclusion(null);
        setExam(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!session?.accessToken) {
        setError("Sessao expirada. Faca login novamente.");
        setConclusion(null);
        setExam(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (mode === "initial") {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const response = await fetchConclusionById({
          accessToken: session.accessToken,
          conclusionId: String(id),
        });
        const normalized = normalizeConclusion(response);
        setConclusion(normalized);

        if (normalized.examId) {
          try {
            const examResponse = await fetchExamById({
              accessToken: session.accessToken,
              examId: normalized.examId,
            });
            setExam(examResponse);
          } catch (examError) {
            console.warn("Failed to load exam details", examError);
            setExam(null);
          }
        } else {
          setExam(null);
        }
      } catch (err) {
        console.error("Failed to load conclusion", err);
        setError("Nao foi possivel carregar a conclusao.");
        setConclusion(null);
        setExam(null);
      } finally {
        if (mode === "initial") {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [id, session?.accessToken]
  );

  useEffect(() => {
    if (!session?.accessToken) return;
    loadConclusion("initial");
  }, [loadConclusion, session?.accessToken]);

  const handleRefresh = useCallback(() => {
    loadConclusion("refresh");
  }, [loadConclusion]);

  const handleOpenFile = useCallback((downloadLink?: string) => {
    if (!downloadLink) return;
    Linking.openURL(downloadLink).catch((err) => {
      console.warn("Failed to open file link", err);
    });
  }, []);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!conclusion) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Nenhuma conclusao disponivel.</ThemedText>
      </ThemedView>
    );
  }

  const examLabel = exam?.examTypeDescription
    ? exam.examTypeDescription
    : `Exame #${conclusion.examId}`;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ThemedView style={styles.section} type="secondary">
          <ThemedText style={styles.titleText}>
            {conclusion.description || "Conclusao"}
          </ThemedText>
          <ThemedText style={styles.metaText}>Exame: {examLabel}</ThemedText>
          <ThemedText style={styles.metaText}>
            Solicitado em:{" "}
            {exam?.requestDate ? formatDateTime(exam.requestDate) : "-"}
          </ThemedText>
          <ThemedText style={styles.metaText}>
            Criado em: {formatDateTime(conclusion.createdAt)}
          </ThemedText>
          {conclusion.updatedAt ? (
            <ThemedText style={styles.metaText}>
              Atualizado em: {formatDateTime(conclusion.updatedAt)}
            </ThemedText>
          ) : null}
          <ThemedText style={styles.metaText}>
            Medico responsavel: #{conclusion.doctorId}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section} type="secondary">
          <InfoField label="Descricao" value={conclusion.description} />
          <InfoField label="Conclusao" value={conclusion.conclusion} />
          {conclusion.notes ? (
            <InfoField label="Notas adicionais" value={conclusion.notes} />
          ) : null}
        </ThemedView>

        {conclusion.files.length > 0 ? (
          <ThemedView style={styles.section} type="secondary">
            <ThemedText style={styles.sectionTitle}>
              Documentos anexos
            </ThemedText>
            <View style={styles.filesContainer}>
              {conclusion.files.map((file) => (
                <PreviewFile
                  key={file.id}
                  description={file.name}
                  file={file}
                  onPress={() => handleOpenFile(file.downloadLink)}
                />
              ))}
            </View>
          </ThemedView>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 32,
  },
  section: {
    gap: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
  },
  metaText: {
    fontSize: 14,
    opacity: 0.8,
  },
  filesContainer: {
    gap: 12,
  },
});
