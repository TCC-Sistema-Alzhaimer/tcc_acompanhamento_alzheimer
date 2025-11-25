import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { createChat, searchUsersForChat } from "@/services/chat-service";
import { ChatResponse, ChatUserSearchResult } from "@/types/api/chat";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type Step = "participants" | "details";

const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Paciente",
  CAREGIVER: "Cuidador",
  DOCTOR: "Medico",
  ADMINISTRATOR: "Administrador",
};

const MIN_SEARCH_LENGTH = 3;
const MIN_NAME_LENGTH = 3;
const MAX_PARTICIPANTS = 50;

export default function CreateChatScreen() {
  const router = useRouter();
  const { getSession } = useAuth();
  const session = getSession;

  const brand = useThemeColor({}, "brandBackground");
  const border = useThemeColor({}, "border");
  const muted = useThemeColor({}, "placeholder");

  const [step, setStep] = useState<Step>("participants");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<ChatUserSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ChatUserSearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selfParticipant = useMemo<ChatUserSearchResult | null>(() => {
    const userId = Number(session?.user?.id);
    if (!userId || Number.isNaN(userId)) return null;
    return {
      id: userId,
      name: session?.user?.name || "Voce",
      email: session?.user?.email || "",
      userType: session?.user?.role as Roles | string | undefined,
    };
  }, [session?.user?.email, session?.user?.id, session?.user?.name, session?.user?.role]);

  useEffect(() => {
    if (!selfParticipant) return;
    setParticipants((prev) => {
      const exists = prev.some((p) => p.id === selfParticipant.id);
      if (exists) {
        return prev.map((p) =>
          p.id === selfParticipant.id ? selfParticipant : p
        );
      }
      return [selfParticipant, ...prev];
    });
  }, [selfParticipant]);

  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }
    if (term.length < MIN_SEARCH_LENGTH || !session?.accessToken) {
      setSearchResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setSearchError(null);
    const timer = setTimeout(() => {
      searchUsersForChat(session.accessToken, term)
        .then((data) => {
          if (!cancelled) {
            setSearchResults(Array.isArray(data) ? data : []);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSearchResults([]);
            setSearchError("Nao foi possivel buscar usuarios agora.");
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearching(false);
          }
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm, session?.accessToken]);

  const selectedIds = useMemo(
    () => new Set(participants.map((p) => p.id)),
    [participants]
  );

  const filteredResults = useMemo(
    () =>
      searchResults.filter((result) => {
        if (!result.id) return false;
        if (selfParticipant && result.id === selfParticipant.id) return false;
        return true;
      }),
    [searchResults, selfParticipant]
  );

  const roleLabel = (value?: string) => ROLE_LABELS[value ?? ""] ?? "Usuario";

  const handleAddParticipant = (user: ChatUserSearchResult) => {
    if (!user?.id || selectedIds.has(user.id)) return;
    if (participants.length >= MAX_PARTICIPANTS) {
      setSubmitError(`Limite de ${MAX_PARTICIPANTS} participantes atingido.`);
      return;
    }
    setSubmitError(null);
    setParticipants((prev) => [...prev, user]);
  };

  const handleRemoveParticipant = (id?: number) => {
    if (!id || (selfParticipant && id === selfParticipant.id)) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const goToDetails = () => {
    if (!participants.length) {
      setSubmitError("Adicione ao menos um participante.");
      return;
    }
    setSubmitError(null);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      setSubmitError("Sua sessao expirou. Faca login novamente.");
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length < MIN_NAME_LENGTH) {
      setNameError(
        `Use pelo menos ${MIN_NAME_LENGTH} caracteres no nome do chat.`
      );
      return;
    }

    const participantIds = participants
      .map((p) => p.id)
      .filter((id): id is number => typeof id === "number");

    if (!participantIds.length) {
      setSubmitError("Adicione ao menos um participante.");
      setStep("participants");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created: ChatResponse = await createChat(session.accessToken, {
        name: trimmedName,
        participantIds,
      });
      router.replace(`/chat/${created.id}`);
    } catch (error) {
      console.error("Falha ao criar chat", error);
      setSubmitError("Nao foi possivel criar o chat agora.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasSession = Boolean(session?.accessToken);
  const canProceed = hasSession && participants.length > 0;
  const canSubmit =
    hasSession &&
    !submitting &&
    name.trim().length >= MIN_NAME_LENGTH &&
    participants.length > 0;

  if (!hasSession) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Faca login para criar um chat.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Novo chat
            </ThemedText>
            <ThemedText style={[styles.helper, { color: muted as any }]}>
              Monte seu grupo em duas etapas: escolha participantes e finalize o
              nome.
            </ThemedText>
          </View>

          <View style={styles.stepper}>
            <StepBadge
              label="Participantes"
              active={step === "participants"}
              index={1}
            />
            <View style={styles.stepDivider} />
            <StepBadge label="Nome" active={step === "details"} index={2} />
          </View>

          {step === "participants" ? (
            <>
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  Participantes
                </ThemedText>
                <ThemedText style={[styles.helper, { color: muted as any }]}>
                  Toque em um usuario para adicionar. Voce ja entra por padrao.
                </ThemedText>

                <View
                  style={[
                    styles.pillContainer,
                    { borderColor: border as any },
                  ]}
                >
                  {participants.length ? (
                    participants.map((participant) => (
                      <Pressable
                        key={participant.id}
                        style={[
                          styles.pill,
                          participant.id === selfParticipant?.id
                            ? styles.pillLocked
                            : null,
                        ]}
                        onPress={() => handleRemoveParticipant(participant.id)}
                        disabled={participant.id === selfParticipant?.id}
                      >
                        <ThemedText style={styles.pillText}>
                          {participant.name}
                        </ThemedText>
                        {participant.id === selfParticipant?.id ? (
                          <ThemedText style={styles.selfTag}>Voce</ThemedText>
                        ) : (
                          <IconSymbol
                            name="xmark.circle.fill"
                            size={14}
                            color="#ffffff"
                          />
                        )}
                      </Pressable>
                    ))
                  ) : (
                    <ThemedText style={styles.helper}>
                      Nenhum participante selecionado.
                    </ThemedText>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  Buscar usuarios
                </ThemedText>
                <ThemedTextInput
                  placeholder={`Digite ao menos ${MIN_SEARCH_LENGTH} caracteres (nome ou email)`}
                  value={searchTerm}
                  onChangeText={(text) => {
                    setSearchTerm(text);
                    setSearchError(null);
                  }}
                  returnKeyType="search"
                />
                <ThemedText style={[styles.helper, { color: muted as any }]}>
                  Resultados aparecem conforme voce digita.
                </ThemedText>

                <View
                  style={[styles.resultsBox, { borderColor: border as any }]}
                >
                  {searching ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color={brand as any} />
                      <ThemedText style={styles.helper}>
                        Buscando usuarios...
                      </ThemedText>
                    </View>
                  ) : filteredResults.length ? (
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      contentContainerStyle={styles.resultsList}
                    >
                      {filteredResults.map((result) => {
                        const isSelected = selectedIds.has(result.id);
                        return (
                          <Card.Root
                            key={result.id}
                            themed={true}
                            style={[
                              styles.resultItem,
                              isSelected && {
                                borderColor: brand,
                                backgroundColor:
                                  Colors.light.secondaryBackground,
                              },
                            ]}
                            onPress={() => handleAddParticipant(result)}
                          >
                            <View style={styles.resultAvatar}>
                              <IconSymbol
                                name="person.fill"
                                size={20}
                                color="#ffffff"
                              />
                            </View>
                            <View style={{ flex: 1, gap: 2 }}>
                              <ThemedText type="defaultSemiBold">
                                {result.name}
                              </ThemedText>
                              <ThemedText style={styles.helper}>
                                {result.email}
                              </ThemedText>
                              <View style={styles.roleBadge}>
                                <ThemedText style={styles.roleBadgeText}>
                                  {roleLabel(result.userType)}
                                </ThemedText>
                              </View>
                            </View>
                            {isSelected ? (
                              <IconSymbol
                                name="checkmark.circle.fill"
                                size={20}
                                color={brand as any}
                              />
                            ) : (
                              <Card.Icon name="person.2.wave.2.fill" />
                            )}
                          </Card.Root>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <ThemedText style={styles.helper}>
                      {searchTerm.trim().length >= MIN_SEARCH_LENGTH
                        ? searchError || "Nenhum usuario encontrado para este termo."
                        : `Digite pelo menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`}
                    </ThemedText>
                  )}
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Revisar grupo</ThemedText>
                <View
                  style={[
                    styles.pillContainer,
                    { borderColor: border as any },
                  ]}
                >
                  {participants.map((participant) => (
                    <Pressable
                      key={participant.id}
                      style={[
                        styles.pill,
                        participant.id === selfParticipant?.id
                          ? styles.pillLocked
                          : null,
                      ]}
                      onPress={() => handleRemoveParticipant(participant.id)}
                      disabled={participant.id === selfParticipant?.id}
                    >
                      <ThemedText style={styles.pillText}>
                        {participant.name}
                      </ThemedText>
                      {participant.id === selfParticipant?.id ? (
                        <ThemedText style={styles.selfTag}>Voce</ThemedText>
                      ) : (
                        <IconSymbol
                          name="xmark.circle.fill"
                          size={14}
                          color="#ffffff"
                        />
                      )}
                    </Pressable>
                  ))}
                </View>
                <ThemedText style={[styles.helper, { color: muted as any }]}>
                  Toque em um participante para remover antes de criar.
                </ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  Nome do chat
                </ThemedText>
                <ThemedTextInput
                  placeholder="Ex.: Acompanhamento da Maria"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError && text.trim().length >= MIN_NAME_LENGTH) {
                      setNameError(null);
                    }
                  }}
                  error={nameError || undefined}
                />
                <ThemedText style={[styles.helper, { color: muted as any }]}>
                  Defina um nome para identificar o grupo.
                </ThemedText>
              </View>
            </>
          )}

          {submitError ? (
            <ThemedText style={styles.errorText}>{submitError}</ThemedText>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step === "details" ? (
            <>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setStep("participants")}
                disabled={submitting}
              >
                <ThemedText style={styles.secondaryText}>Voltar</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.primaryButton,
                  !canSubmit && styles.buttonDisabled,
                  { backgroundColor: brand as any },
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.primaryText}>Criar chat</ThemedText>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.back()}
              >
                <ThemedText style={styles.secondaryText}>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.primaryButton,
                  !canProceed && styles.buttonDisabled,
                  { backgroundColor: brand as any },
                ]}
                onPress={goToDetails}
                disabled={!canProceed}
              >
                <ThemedText style={styles.primaryText}>Continuar</ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

function StepBadge({ label, active, index }: { label: string; active: boolean; index: number }) {
  return (
    <View
      style={[
        styles.stepBadge,
        active ? styles.stepBadgeActive : styles.stepBadgeInactive,
      ]}
    >
      <ThemedText style={styles.stepIndex}>{index}</ThemedText>
      <ThemedText
        style={[
          styles.stepLabel,
          active ? styles.stepLabelActive : styles.stepLabelInactive,
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 22,
  },
  helper: {
    fontSize: 13,
    opacity: 0.8,
    flexShrink: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#d4d4d8",
  },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepBadgeActive: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  stepBadgeInactive: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  stepIndex: {
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepLabelActive: {
    color: "#0ea5e9",
  },
  stepLabelInactive: {
    color: "#6b7280",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  pillContainer: {
    minHeight: 56,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    rowGap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1e88e5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pillLocked: {
    backgroundColor: "#2563eb",
    opacity: 0.9,
  },
  pillText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  selfTag: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  resultsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    maxHeight: 360,
    width: "100%",
  },
  resultsList: {
    gap: 10,
    paddingBottom: 8,
  },
  resultItem: {
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    width: "100%",
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
  },
  roleBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    minHeight: 32,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: Colors.light.brandBackground,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryText: {
    color: "#4b5563",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
  },
});
