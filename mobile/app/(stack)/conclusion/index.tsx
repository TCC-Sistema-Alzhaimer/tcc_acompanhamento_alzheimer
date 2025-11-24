import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchConclusionsByExamId } from "@/services/conclusion-service";
import { fetchExamsByPatientId } from "@/services/exam-service";
import { ConclusionResponse } from "@/types/api/conclusion";
import { Exam } from "@/types/domain/exam";
import { formatDateTime } from "@/util/format";
import { perserConclusion } from "@/util/parser";
import { useRouter } from "expo-router";

type ConclusionListItem = ConclusionResponse & {
  examTypeDescription?: string;
  examStatusDescription?: string;
  requestDate?: string;
};

function buildSubtitle(item: ConclusionListItem) {
  const examLabel = item.examTypeDescription
    ? item.examTypeDescription
    : `Exame #${item.examId}`;
  const createdAt = formatDateTime(item.createdAt);
  const previewSource = item.conclusion
    ? `Resumo: ${
        item.conclusion.length > 80
          ? `${item.conclusion.slice(0, 80)}...`
          : item.conclusion
      }`
    : null;

  return [examLabel, createdAt, previewSource].filter(Boolean).join("\n");
}

export default function ConclusionScreen() {
  const router = useRouter();
  const session = useSession();
  const {
    state: { patientId },
    loading: loadingSelectedPatient,
  } = useSelectedPatient();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ConclusionListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadConclusions = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!session?.accessToken || !patientId) {
        if (!session?.accessToken) {
          setError("Sessao expirada. Faca login novamente.");
        }
        setItems([]);
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
        const exams: Exam[] = await fetchExamsByPatientId({
          accessToken: session.accessToken,
          patientId,
        });

        const promises = exams
          .filter((exam) => exam.id != null)
          .map(async (exam) => {
            const examId = String(exam.id);
            const response = await fetchConclusionsByExamId({
              accessToken: session.accessToken,
              examId,
            });

            return response.map((conclusion) => {
              const normalized = perserConclusion(conclusion);
              return {
                ...normalized,
                examTypeDescription: exam.examTypeDescription,
                examStatusDescription: exam.examStatusDescription,
                requestDate: exam.requestDate,
              };
            });
          });

        const settled = await Promise.allSettled(promises);
        const aggregated: ConclusionListItem[] = [];

        settled.forEach((result) => {
          if (result.status === "fulfilled") {
            aggregated.push(...result.value);
          } else {
            console.warn(
              "Failed to load conclusions for an exam",
              result.reason
            );
          }
        });

        aggregated.sort((a, b) => {
          const getTime = (value?: string) => {
            if (!value) return 0;
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? 0 : date.getTime();
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        });

        setItems(aggregated);
      } catch (err) {
        console.error("Failed to load conclusions", err);
        setError("Nao foi possivel carregar as conclusões.");
        setItems([]);
      } finally {
        if (mode === "initial") {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    [patientId, session?.accessToken]
  );

  useEffect(() => {
    if (loadingSelectedPatient) return;
    if (!session?.accessToken) return;
    loadConclusions("initial");
  }, [loadConclusions, loadingSelectedPatient, session?.accessToken]);

  const handleRefresh = useCallback(() => {
    loadConclusions("refresh");
  }, [loadConclusions]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ConclusionListItem>) => (
      <Card.Root
        themed={false}
        style={styles.card}
        onPress={() => router.push(`/conclusion/${item.id}`)}
      >
        <IconSymbol name="doc.text.magnifyingglass" size={28} color="#2563eb" />
        <Card.Title
          title={item.description || "Conclusão Médica"}
          subtitle={buildSubtitle(item)}
          style={{ flex: 1 }}
        />
        <Card.Icon name="chevron.right" />
      </Card.Root>
    ),
    [router]
  );

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <FlatList
        data={items}
        keyExtractor={(item, index) => item.id || `conclusion-${index}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText type="title">Ops!</ThemedText>
            <ThemedText style={styles.emptyText}>
              Nenhuma conclusao cadastrada para o paciente.
            </ThemedText>
          </View>
        }
        contentContainerStyle={
          items.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />
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
  },
  errorText: {
    color: "#f87171",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    alignItems: "center",
  },
});
