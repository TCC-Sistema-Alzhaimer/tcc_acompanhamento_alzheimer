import UploadFileModal from "@/app/(modals)/upload-file";
import { PreviewFile } from "@/components/files/PreviewFile";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import {
  fetchHistoricExamsByPatientId,
  uploadHistoricExamAttachment,
} from "@/services/exam-service";
import { HistoricExamResponse } from "@/types/api/exam";
import { DocumentPickerAsset } from "expo-document-picker";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StyleSheet } from "react-native";

function groupExamsByDate(exams: HistoricExamResponse[]) {
  const groups: Record<string, HistoricExamResponse[]> = {
    Hoje: [],
    Ontem: [],
    "Esta semana": [],
    "Este mês": [],
    "Mais antigos": [],
  };

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()); // domingo
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  exams.forEach((exam) => {
    const date = new Date(exam.createdAt);

    if (date >= startOfToday) {
      groups["Hoje"].push(exam);
    } else if (date >= startOfYesterday) {
      groups["Ontem"].push(exam);
    } else if (date >= startOfWeek) {
      groups["Esta semana"].push(exam);
    } else if (date >= startOfMonth) {
      groups["Este mês"].push(exam);
    } else {
      groups["Mais antigos"].push(exam);
    }
  });

  return groups;
}

export default function ExamHistoricScreen() {
  const [openModal, setOpenModal] = useState(false);
  const [historicExams, setHistoricExams] = useState<HistoricExamResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const { state } = useSelectedPatient();

  const loadHistoricExams = async () => {
    if (!session?.accessToken || !state.patientId) return;
    try {
      setLoading(true);
      const resp: HistoricExamResponse[] = await fetchHistoricExamsByPatientId({
        accessToken: session.accessToken,
        patientId: state.patientId,
      });
      setHistoricExams(resp);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (
    file: DocumentPickerAsset,
    description?: string
  ) => {
    if (!session?.accessToken || !file.uri || !state.patientId) return;

    await uploadHistoricExamAttachment({
      accessToken: session.accessToken,
      patientId: state.patientId,
      description: description || "",
      file,
    });

    await loadHistoricExams();
  };

  useEffect(() => {
    loadHistoricExams();
  }, [session?.accessToken, state.patientId]);

  const groupedExams = useMemo(
    () => groupExamsByDate(historicExams),
    [historicExams]
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="primary">Histórico de Exames</ThemedText>
        <ThemedButton
          title="Adicionar"
          type="primary"
          onPress={() => setOpenModal(true)}
        />
      </ThemedView>

      {/* Conteúdo */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {Object.entries(groupedExams).map(([label, exams]) =>
            exams.length > 0 ? (
              <ThemedView key={label} style={styles.section}>
                <ThemedText style={styles.sectionTitle}>{label}</ThemedText>
                <ThemedView style={styles.gallery}>
                  {exams.map((exam) => (
                    <PreviewFile
                      key={exam.id}
                      description={exam.description}
                      file={exam.files[0]}
                    />
                  ))}
                </ThemedView>
              </ThemedView>
            ) : null
          )}
        </ScrollView>
      )}

      {/* Modal de upload */}
      <Modal visible={openModal} animationType="fade" transparent={true}>
        <UploadFileModal
          onClose={() => setOpenModal(false)}
          upload={(file, description) => handleUpload(file, description)}
          relatedId={state.cachedPatient?.name || "Desconhecido"}
          descriptionEnable={true}
        />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
});
