import { AxiosError } from "axios";
import * as DocumentPicker from "expo-document-picker";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSession } from "@/hooks/useSession";
import { FileUploadResponse } from "@/types/api/files";

interface UploadFileModalProps {
  relatedId: string;
  relatedLabel?: string;
  onClose: () => void;
  upload: (
    file: DocumentPicker.DocumentPickerAsset,
    description?: string
  ) => Promise<FileUploadResponse | undefined>;
  onUploaded?: (response: FileUploadResponse) => void;
  descriptionEnable?: boolean;
}

type UploadState = "idle" | "uploading" | "success";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

function formatFileSize(size?: number | null) {
  if (size == null) return "-";
  if (size === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  );
  const value = size / Math.pow(1024, exponent);
  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${
    units[exponent]
  }`;
}

export default function UploadFileModal({
  relatedId,
  relatedLabel,
  onClose,
  upload,
  onUploaded,
  descriptionEnable = false,
}: UploadFileModalProps) {
  const session = useSession();
  const [selectedAsset, setSelectedAsset] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<FileUploadResponse | null>(
    null
  );
  const [description, setDescription] = useState<string>("");

  const iconName = useMemo(() => {
    const mimeType = selectedAsset?.mimeType ?? "";
    if (mimeType.includes("pdf")) {
      return "doc.richtext.fill";
    }
    if (mimeType.startsWith("image/")) {
      return "photo.on.rectangle.angled";
    }
    if (mimeType.includes("excel")) {
      return "tablecells.fill";
    }
    if (mimeType.includes("word") || mimeType.includes("text/")) {
      return "doc.plaintext.fill";
    }
    return "doc.fill";
  }, [selectedAsset?.mimeType]);

  const hasSession = Boolean(session?.accessToken);
  const hasTarget = Boolean(relatedId);
  const canUpload =
    hasSession && hasTarget && selectedAsset && state !== "uploading";
  const primaryLabel =
    state === "success"
      ? "Concluir"
      : state === "uploading"
      ? `Enviando ${progress}%`
      : "Enviar arquivo";

  const handlePickFile = async () => {
    setErrorMessage(null);
    setLastResponse(null);

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.length) {
      setSelectedAsset(result.assets[0]);
      setState("idle");
    }
  };

  const handleUpload = async () => {
    if (!relatedId) {
      setErrorMessage(
        "Nao foi possivel identificar o registro para anexar este documento."
      );
      return;
    }

    if (!session?.accessToken) {
      setErrorMessage(
        "Sua sessao expirou. Faca login novamente para anexar documentos."
      );
      return;
    }

    if (!selectedAsset) {
      setErrorMessage("Selecione um arquivo primeiro.");
      return;
    }

    if (
      typeof selectedAsset.size === "number" &&
      selectedAsset.size > MAX_UPLOAD_SIZE
    ) {
      setErrorMessage(
        "O arquivo selecionado excede o limite recomendado de 10 MB."
      );
      return;
    }

    setState("uploading");
    setErrorMessage(null);
    setProgress(0);

    try {
      const response = await upload(selectedAsset, description);

      setLastResponse(response ?? null);
      setState("success");
      setSelectedAsset(null);
      onUploaded?.(response as FileUploadResponse);
    } catch (error) {
      console.error("Failed to upload file", error);
      let message = "Nao foi possivel enviar o arquivo. Tente novamente.";
      if (error instanceof AxiosError) {
        const dataMessage = (
          error.response?.data as { message?: string } | undefined
        )?.message;
        message = dataMessage ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      setState("idle");
    }
  };

  const handlePrimaryAction = () => {
    if (state === "success") {
      onClose();
      return;
    }
    handleUpload();
  };

  return (
    <View style={styles.overlay}>
      <ThemedView style={styles.card} type="secondary">
        <View style={styles.header}>
          <ThemedText style={styles.title} type="title">
            Anexar documento
          </ThemedText>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark.circle.fill" size={22} color="#808080" />
          </Pressable>
        </View>

        <ThemedText style={styles.subtitle}>
          {relatedLabel ? relatedLabel : `Registro associado: #${relatedId}`}
        </ThemedText>
        <ThemedText style={styles.helperText}>
          Selecione um arquivo (PDF, imagem ou documento) para anexar ao
          registro. Tamanho maximo recomendado: 10 MB.
        </ThemedText>

        <Pressable
          style={styles.uploadArea}
          onPress={handlePickFile}
          accessibilityRole="button"
        >
          <IconSymbol name={iconName} size={36} color="#2563eb" />
          <View style={{ marginLeft: 12 }}>
            <ThemedText style={styles.uploadLabel} type="subtitle">
              {selectedAsset?.name ?? "Escolher arquivo"}
            </ThemedText>
            <ThemedText style={styles.uploadHint}>
              {selectedAsset
                ? formatFileSize(selectedAsset.size ?? undefined)
                : "Toque para procurar no seu dispositivo"}
            </ThemedText>
          </View>
        </Pressable>

        {descriptionEnable ? (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>
              Descricao (opcional)
            </ThemedText>
            <ThemedTextInput
              onChangeText={setDescription}
              value={description}
              placeholder="Descricao"
            />
          </View>
        ) : null}

        {state === "uploading" ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>
              Enviando... {progress}%
            </ThemedText>
          </View>
        ) : null}

        {errorMessage ? (
          <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
        ) : null}

        {state === "success" && lastResponse ? (
          <View style={styles.successBox}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={20}
              color="#16a34a"
            />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <ThemedText style={styles.successTitle}>
                Arquivo enviado com sucesso!
              </ThemedText>
              <ThemedText style={styles.successSubtitle}>
                {lastResponse.fileName}
              </ThemedText>
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={onClose}
            disabled={state === "uploading"}
          >
            <ThemedText type="secondary">Cancelar</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.primaryButton,
              !canUpload && state !== "success" ? styles.buttonDisabled : null,
            ]}
            onPress={handlePrimaryAction}
            disabled={!canUpload && state !== "success"}
          >
            {state === "uploading" ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText type="primary">{primaryLabel}</ThemedText>
            )}
          </Pressable>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    maxWidth: 420,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  helperText: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  uploadLabel: {
    fontSize: 15,
  },
  uploadHint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 96,
    textAlignVertical: "top",
    fontSize: 14,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#dbeafe",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#dcfce7",
  },
  successTitle: {
    fontSize: 14,
    color: "#15803d",
  },
  successSubtitle: {
    fontSize: 12,
    color: "#166534",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
