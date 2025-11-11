import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { fetchExamsByPatientId } from "@/services/exam-service";
import { Exam } from "@/types/domain/exam";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type Filter = "ALL" | "INPROCESS" | "COMPLETED" | "CANCELLED";

const PAGE_SIZE = 10;

/*
    REQUESTED("Solicitado"),
    SCHEDULED("Agendado"),
    IN_PROGRESS("Em Andamento"),
    COMPLETED("Concluído"),
    CANCELLED("Cancelado"),
    PENDING_RESULT("Aguardando Resultado");
*/

// Garante compat com ids "pending/done" OU "pendente/realizado"
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
      id === "COMPLETED" || id === "cancelado" || desc.includes("cancelado")
    );
  }
  if (filter === "INPROCESS") {
    const isCancelled =
      id === "cancelled" ||
      id === "cancelado" ||
      desc.includes("cancelado") ||
      desc.includes("cancel");
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

  const { state, loading: loadingSelected } = useSelectedPatient();
  const router = useRouter();
  const session = useSession();

  const loadExams = async () => {
    if (session !== null) {
      try {
        const resp = await fetchExamsByPatientId({
          accessToken: session.accessToken,
          patientId: state.patientId!,
        });
        console.log("Exames carregados:", resp);
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

  const isActive = (f: Filter) => f === filter;

  const renderFilterButton = (label: string, f: Filter) => (
    <TouchableOpacity key={f} onPress={() => handleChangeFilter(f)}>
      <ThemedView
        type="default"
        style={{
          padding: 16,
          borderRadius: 8,
          margin: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: isActive(f) ? 1 : 0.6,
          borderWidth: isActive(f) ? 2 : 0,
          borderColor: isActive(f) ? "#fff" : "transparent",
        }}
      >
        <ThemedText type="default">{label}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedView type="secondary" style={{ borderRadius: 8, marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            maxWidth: "100%",
          }}
        >
          {renderFilterButton("Todos", "ALL")}
          {renderFilterButton("Em Processo", "INPROCESS")}
          {renderFilterButton("Cancelado", "CANCELLED")}
          {renderFilterButton("Realizados", "COMPLETED")}
        </View>
      </ThemedView>

      <FlatList
        data={visibleData}
        keyExtractor={(item, index) => item.id ?? `exam-${index}`}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <ThemedText
              style={{ padding: 16, textAlign: "center" }}
              type="title"
            >
              Ops!
            </ThemedText>
            <ThemedText
              style={{ paddingHorizontal: 16, textAlign: "center" }}
              type="default"
            >
              Nenhum exame encontrado para o paciente neste filtro.
            </ThemedText>
          </View>
        }
        renderItem={({ item: exam }) => (
          <Card.Root
            themed={false}
            style={{ marginVertical: 6, padding: 16 }}
            onPress={() => router.push(`/exam/${exam.id}`)}
          >
            <Card.Title
              title={exam.examTypeDescription ?? "Exame"}
              subtitle={`Status: ${exam.examStatusDescription ?? "-"}`}
            />
            <Card.Icon name="chevron.right" />
          </Card.Root>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          visibleData.length < filteredExams.length ? (
            <Text style={{ textAlign: "center", padding: 12 }}>
              carregando mais...
            </Text>
          ) : null
        }
      />
    </ThemedView>
  );
}
