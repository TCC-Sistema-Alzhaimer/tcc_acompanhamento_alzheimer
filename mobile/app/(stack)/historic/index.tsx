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
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StyleSheet } from "react-native";

export default function ExamHistoricScreen() {
  const [openModal, setOpenModal] = useState(false);
  const [historicExams, setHistoricExams] = useState<HistoricExamResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const { state } = useSelectedPatient();

  const loadHistoricExams = async () => {
    if (!session?.accessToken) return;
    if (!state.patientId) return;

    const resp: HistoricExamResponse[] = await fetchHistoricExamsByPatientId({
      accessToken: session.accessToken,
      patientId: state.patientId,
    });
    setLoading(false);
    setHistoricExams(resp);
  };

  const handleUpload = async (
    file: DocumentPickerAsset,
    description?: string
  ) => {
    if (!session?.accessToken) return;
    if (!file.uri) return;
    if (!state.patientId) return;

    const resp = await uploadHistoricExamAttachment({
      accessToken: session.accessToken,
      patientId: state.patientId,
      description: description || "",
      file: file,
    });

    return resp;
  };

  useEffect(() => {
    loadHistoricExams();
  }, [session?.accessToken, state.patientId]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="primary">Histórico de Exames</ThemedText>
        <ThemedButton
          title="Adicionar"
          type="primary"
          onPress={() => setOpenModal(true)}
        />
      </ThemedView>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.gallery}>
            {historicExams.map((exam) => (
              <PreviewFile
                key={exam.id}
                description={exam.description}
                file={exam.files[0]}
              />
            ))}
          </ThemedView>
        </ScrollView>
      )}

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
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
