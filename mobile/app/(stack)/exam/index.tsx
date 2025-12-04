import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors"; // Importando sua paleta
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/hooks/useSession";
import { fetchExamsByPatientId } from "@/services/exam-service";
import { Exam } from "@/types/domain/exam";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Filter = "ALL" | "INPROCESS" | "COMPLETED" | "CANCELLED";

const PAGE_SIZE = 10;

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const backgroundColor = isActive ? colors.tint : colors.card;

  const textColor = isActive ? "#FFFFFF" : colors.secondaryText;

  const borderColor = isActive ? "transparent" : colors.border;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        { backgroundColor, borderColor, borderWidth: isActive ? 0 : 1 },
      ]}
    >
      <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// --- Funções Auxiliares ---
function matchesStatus(exam: Exam, filter: Exclude<Filter, "ALL">) {
  const id = (exam.examStatusId || "").toLowerCase();
  const desc = (exam.examStatusDescription || "").toLowerCase();

  if (filter === "CANCELLED") {
    return (
      id === "CANCELLED" || id === "cancelado" || desc.includes("cancelado")
    );
  }
  if (filter === "COMPLETED") {
    return (
      id === "COMPLETED" ||
      id === "done" ||
      id === "realizado" ||
      desc.includes("realiz") ||
      desc.includes("conclu") ||
      desc.includes("complet")
    );
  }
  if (filter === "INPROCESS") {
    const isCancelled =
      id === "cancelled" || id === "cancelado" || desc.includes("cancelado");
    const isCompleted =
      id === "completed" ||
      id === "done" ||
      id === "realizado" ||
      desc.includes("realiz") ||
      desc.includes("conclu") ||
      desc.includes("complet");
    return !isCancelled && !isCompleted;
  }
  return true;
}

export default function ExamScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);
  const theme = useColorScheme() ?? "light";

  const { state, loading: loadingSelected } = useSelectedPatient();
  const router = useRouter();
  const session = useSession();

  const loadExams = async () => {
    if (session !== null && state.patientId) {
      try {
        const resp = await fetchExamsByPatientId({
          accessToken: session.accessToken,
          patientId: state.patientId,
        });
        setExams(resp);
      } catch (error) {
        console.error("Erro ao carregar exames:", error);
        setExams([]);
      }
    }
  };

  useEffect(() => {
    if (loadingSelected) return;
    loadExams();
  }, [loadingSelected]);

  const filteredExams = useMemo(() => {
    if (filter === "ALL") return exams;
    return exams.filter((e) => matchesStatus(e, filter));
  }, [exams, filter]);

  const visibleData = useMemo(() => {
    return filteredExams.slice(0, page * PAGE_SIZE);
  }, [filteredExams, page]);

  const handleChangeFilter = useCallback((f: Filter) => {
    setFilter(f);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (visibleData.length < filteredExams.length) {
      setPage((p) => p + 1);
    }
  }, [visibleData.length, filteredExams.length]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <FilterChip
            label="Todos"
            isActive={filter === "ALL"}
            onPress={() => handleChangeFilter("ALL")}
          />
          <FilterChip
            label="Em Processo"
            isActive={filter === "INPROCESS"}
            onPress={() => handleChangeFilter("INPROCESS")}
          />
          <FilterChip
            label="Realizados"
            isActive={filter === "COMPLETED"}
            onPress={() => handleChangeFilter("COMPLETED")}
          />
          <FilterChip
            label="Cancelados"
            isActive={filter === "CANCELLED"}
            onPress={() => handleChangeFilter("CANCELLED")}
          />
        </ScrollView>
      </View>

      {/* Lista de Exames */}
      <FlatList
        data={visibleData}
        keyExtractor={(item, index) => item.id ?? `exam-${index}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        // Empty State estilizado
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
              Nenhum exame encontrado
            </ThemedText>
            <ThemedText
              style={{
                color: Colors[theme].secondaryText,
                textAlign: "center",
              }}
            >
              Não há exames para este filtro no momento.
            </ThemedText>
          </View>
        }
        renderItem={({ item: exam }) => (
          <Card.Root
            style={{ marginBottom: 12 }}
            onPress={() => router.push(`/exam/${exam.id}`)}
          >
            <Card.Title
              title={exam.examTypeDescription ?? "Exame sem título"}
              subtitle={exam.examStatusDescription ?? "Status desconhecido"}
            />
            <Card.Icon name="chevron.right" type="primary" />
          </Card.Root>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          visibleData.length < filteredExams.length ? (
            <Text
              style={{
                textAlign: "center",
                padding: 12,
                color: Colors[theme].secondaryText,
              }}
            >
              Carregando mais...
            </Text>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
