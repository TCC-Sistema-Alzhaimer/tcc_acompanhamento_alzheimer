import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import UploadFileModal from "@/app/(modals)/upload-file";
import { ExamStatus } from "@/components/ExamStatus";
import { InfoField } from "@/components/InfoField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSession } from "@/hooks/useSession";
import { fetchExamById } from "@/services/exam-service";
import { uploadExamAttachment } from "@/services/file-service";
import { FileUploadResponse } from "@/types/api/files";
import { Exam } from "@/types/domain/exam";
import { Roles } from "@/types/enum/roles";
import * as DocumentPicker from "expo-document-picker";

type LocalParams = { id?: string };

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<LocalParams>();
  const session = useSession();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<FileUploadResponse | null>(
    null
  );

  useEffect(() => {
    let active = true;

    const findFallbackExam = async (): Promise<Exam | null> => {
      if (!id) {
        return null;
      }
      if (session === null) {
        return null;
      }
      const resp = await fetchExamById({
        accessToken: session.accessToken,
        examId: String(id),
      });
      if (resp) {
        return resp;
      }
      return null;
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
          setExam(await findFallbackExam());
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
          setExam(await findFallbackExam());
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

  const handleUpload = async (file: DocumentPicker.DocumentPickerAsset) => {
    if (!session?.accessToken) return;
    if (!id) return;
    if (!file.uri) return;

    const response = await uploadExamAttachment({
      accessToken: session.accessToken,
      examId: id,
      file: {
        uri: file.uri,
        name: file.name ?? `arquivo-${Date.now()}`,
        mimeType: file.mimeType,
      },
    });

    return response;
  };

  const requestDate = exam?.requestDate
    ? new Date(exam.requestDate).toLocaleDateString()
    : "-";

  const modalLabel = useMemo(() => {
    if (!exam) return `Exame #${id ?? "-"}`;
    const parts: string[] = [];
    if (exam.examTypeDescription) {
      parts.push(exam.examTypeDescription);
    }
    parts.push(`Exame #${exam.id ?? id ?? "-"}`);
    return parts.join(" - ");
  }, [exam, id]);

  const resolvedExamId = useMemo(() => {
    if (exam?.id) return String(exam.id);
    if (typeof id === "string") return id;
    if (Array.isArray(id)) return id[0];
    return "";
  }, [exam?.id, id]);

  return (
    <ThemedView style={styles.container} type="default">
      {lastUploaded ? (
        <ThemedView style={styles.banner} type="secondary">
          <IconSymbol name="paperclip.circle.fill" size={20} color="#2563eb" />
          <View style={styles.bannerText}>
            <ThemedText style={styles.bannerTitle}>
              Ultimo documento enviado
            </ThemedText>
            <ThemedText style={styles.bannerSubtitle}>
              {lastUploaded.fileName}
            </ThemedText>
          </View>
        </ThemedView>
      ) : null}

      {loading ? (
        <ActivityIndicator />
      ) : exam ? (
        <ThemedView style={styles.content} type="secondary">
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText>Solicitado em: {requestDate}</ThemedText>
            <ExamStatus status={exam.examStatusDescription} />
          </View>

          <InfoField
            label="Tipo de exame:"
            value={exam.examTypeDescription ?? "-"}
          />
          {exam.instructions ? (
            <InfoField label="Instrucoes:" value={exam.instructions} />
          ) : null}
          {exam.result ? (
            <InfoField label="Resultado:" value={exam.result} />
          ) : null}
          {exam.note ? (
            <InfoField label="Observações:" value={exam.note} />
          ) : null}
          {exam.updatedAt ? (
            <ThemedText>
              Atualizado em: {new Date(exam.updatedAt).toLocaleString()}
            </ThemedText>
          ) : null}
          {session?.user.role !== Roles.PATIENT && (
            <Pressable onPress={() => setOpenModal(true)}>
              <ThemedView
                type="default"
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <IconSymbol
                  name="paperclip.circle.fill"
                  size={20}
                  color="#2563eb"
                />
                <ThemedText style={{ color: "#2563eb", fontWeight: "600" }}>
                  Anexar documento
                </ThemedText>
              </ThemedView>
            </Pressable>
          )}
        </ThemedView>
      ) : (
        <ThemedText>Nenhum exame encontrado.</ThemedText>
      )}

      <Modal
        visible={openModal}
        animationType="fade"
        transparent
        statusBarTranslucent
      >
        <UploadFileModal
          relatedId={resolvedExamId}
          relatedLabel={modalLabel}
          onClose={() => setOpenModal(false)}
          upload={handleUpload}
          onUploaded={(file) => {
            setLastUploaded(file);
            setOpenModal(false);
          }}
        />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: {
    gap: 12,
    alignContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  bannerSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
});
