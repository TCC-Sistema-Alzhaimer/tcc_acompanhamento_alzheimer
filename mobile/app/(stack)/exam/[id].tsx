import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import UploadFileModal from "@/app/(modals)/upload-file";
import { ExamStatus } from "@/components/ExamStatus";
import { InfoField } from "@/components/InfoField";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSession } from "@/hooks/useSession";
import {
  fetchAttachedExamFile,
  fetchExamById,
  sendExamForCompletion,
} from "@/services/exam-service";
import { uploadExamAttachment } from "@/services/file-service";
import { AttachmentedFileResponse } from "@/types/api/exam";
import { FileUploadResponse } from "@/types/api/files";
import { Exam } from "@/types/domain/exam";
import { ExamStatus as ExamStatusEnum } from "@/types/enum/exam-status";
import { Roles } from "@/types/enum/roles";
import * as DocumentPicker from "expo-document-picker";

type LocalParams = { id?: string };

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<LocalParams>();
  const session = useSession();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [files, setFiles] = useState<AttachmentedFileResponse[]>([]);
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
      const files = await fetchAttachedExamFile({
        accessToken: session.accessToken,
        examId: String(id),
      });
      if (resp) {
        return resp;
      }
      return null;
    };

    const findAttachedFiles = async (): Promise<void> => {
      if (!id) {
        return;
      }
      if (session === null) {
        return;
      }
      const attachedFiles = await fetchAttachedExamFile({
        accessToken: session.accessToken,
        examId: String(id),
      });
      if (active) {
        setFiles(attachedFiles);
      }
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
        console.log("Exame carregado:", data);

        await findAttachedFiles();

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

  const handleOpenFile = async (file: AttachmentedFileResponse) => {
    try {
      if (!file.downloadLink) {
        Alert.alert("Erro", "Link para visualização não disponível.");
        return;
      }

      const supported = await Linking.canOpenURL(file.downloadLink);

      if (supported) {
        await Linking.openURL(file.downloadLink);
      } else {
        Alert.alert("Erro", "Não foi possível abrir este arquivo.");
      }
    } catch (error) {
      console.error("Erro ao abrir arquivo:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o arquivo.");
    }
  };

  const getFileIconName = (file: AttachmentedFileResponse): string => {
    if (file.isImage) {
      return "photo.on.rectangle.angled";
    }
    return "doc.fill";
  };

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

  const sendForCompletion = async () => {
    try {
      const resp = await sendExamForCompletion({
        accessToken: session!.accessToken,
        examId: String(id),
      });
      setExam(resp);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o exame para conclusão.");
    }
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {lastUploaded ? (
          <ThemedView style={styles.banner} type="secondary">
            <IconSymbol
              name="paperclip.circle.fill"
              size={20}
              color="#2563eb"
            />
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

        {files.length > 0 ? (
          <ThemedView style={styles.banner} type="secondary">
            <View style={styles.bannerHeader}>
              <IconSymbol
                name="paperclip.circle.fill"
                size={20}
                color="#2563eb"
              />
              <ThemedText style={styles.bannerTitle}>
                Documentos anexados ({files.length})
              </ThemedText>
            </View>

            <View style={styles.fileList}>
              {files.map((file) => (
                <Pressable key={file.id} onPress={() => handleOpenFile(file)}>
                  <ThemedView type="card" style={styles.fileItem}>
                    <IconSymbol
                      name={getFileIconName(file) as any}
                      size={20}
                      color="#555"
                    />

                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.fileName}>
                        {file.fileName}
                      </ThemedText>
                      <ThemedText style={styles.fileSize}>
                        {file.formattedFileSize}
                      </ThemedText>
                    </View>

                    <IconSymbol
                      name="magnifyingglass"
                      size={16}
                      color="#2563eb"
                    />
                  </ThemedView>
                </Pressable>
              ))}
            </View>
          </ThemedView>
        ) : null}

        {loading ? (
          <ActivityIndicator />
        ) : exam ? (
          <ThemedView style={styles.content}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <ThemedText>Solicitado em: {requestDate}</ThemedText>
              <ExamStatus status={exam.examStatusDescription} />
            </View>

            <InfoField
              label="Tipo de exame:"
              value={exam.examTypeDescription ?? "-"}
              addSeparator={true}
            />
            {exam.instructions ? (
              <InfoField
                label="Instrucoes:"
                value={exam.instructions}
                addSeparator={true}
              />
            ) : null}
            {exam.result ? (
              <InfoField
                label="Resultado:"
                value={exam.result}
                addSeparator={true}
              />
            ) : null}
            {exam.note ? (
              <InfoField
                label="Observações:"
                value={exam.note}
                addSeparator={true}
              />
            ) : null}
            {exam.updatedAt ? (
              <ThemedText>
                Atualizado em: {new Date(exam.updatedAt).toLocaleString()}
              </ThemedText>
            ) : null}
            {session?.user.role !== Roles.PATIENT && (
              <ThemedButton
                type={
                  exam.examStatusDescription === ExamStatusEnum.REQUESTED
                    ? "primary"
                    : "disabled"
                }
                title="Anexar documento"
                onPress={() => setOpenModal(true)}
              >
                <IconSymbol
                  name="paperclip.circle.fill"
                  size={20}
                  color="#2563eb"
                />
              </ThemedButton>
            )}
          </ThemedView>
        ) : (
          <ThemedText>Nenhum exame encontrado.</ThemedText>
        )}
      </ScrollView>

      {!loading && exam && (
        <View style={styles.footerButtons}>
          {(files.length > 0 || lastUploaded) && (
            <ThemedButton
              title="Enviar para conclusão"
              type={
                exam.examStatusDescription === ExamStatusEnum.REQUESTED
                  ? "primary"
                  : "disabled"
              }
              onPress={sendForCompletion}
            >
              <IconSymbol
                name="arrow.right.circle.fill"
                size={20}
                color="#fff"
              />
            </ThemedButton>
          )}
          <ThemedButton
            title="Voltar"
            type="secondary"
            onPress={() => router.back()}
          >
            <IconSymbol name="arrow.left.circle.fill" size={20} color="#fff" />
          </ThemedButton>
        </View>
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
    flex: 1,
    gap: 12,
    alignContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  banner: {
    padding: 16,
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
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 11,
    opacity: 0.6,
  },
  footerButtons: {
    paddingTop: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
});
