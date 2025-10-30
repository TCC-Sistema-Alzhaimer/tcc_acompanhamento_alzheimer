import UploadFileModal from "@/app/(modals)/upload-file";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import { uploadHistoricExamAttachment } from "@/services/exam-service";
import { DocumentPickerAsset } from "expo-document-picker";
import { useState } from "react";
import { Modal, StyleSheet } from "react-native";

export default function ExamHistoricScreen() {
  const [openModal, setOpenModal] = useState(false);

  const session = useSession();
  const { state } = useSelectedPatient();

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
    console.log("Upload response:", resp);
    return undefined;
  };

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
});
