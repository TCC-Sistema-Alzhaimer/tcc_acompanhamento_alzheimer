import { Card } from "@/components/card/Card";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
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
  useColorScheme,
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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();
  const { getSession } = useAuth();
  const session = getSession;

  const [step, setStep] = useState<Step>("participants");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<ChatUserSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ChatUserSearchResult[]>(
    []
  );
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
  }, [
    session?.user?.email,
    session?.user?.id,
    session?.user?.name,
    session?.user?.role,
  ]);

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
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ThemedView style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemedText type="title">Novo chat</ThemedText>
              <ThemedText style={{ color: colors.secondaryText }}>
                Monte seu grupo em duas etapas: escolha participantes e finalize
                o nome.
              </ThemedText>
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              <StepBadge
                label="Participantes"
                active={step === "participants"}
                index={1}
                theme={theme}
              />
              <View
                style={[styles.stepDivider, { backgroundColor: colors.border }]}
              />
              <StepBadge
                label="Detalhes"
                active={step === "details"}
                index={2}
                theme={theme}
              />
            </View>

            {step === "participants" ? (
              <View style={styles.contentGap}>
                {/* Seção: Participantes Selecionados */}
                <View>
                  <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
                    Participantes
                  </ThemedText>

                  <View
                    style={[
                      styles.pillContainer,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.secondaryBackground,
                      },
                    ]}
                  >
                    {participants.length > 0 ? (
                      participants.map((participant, i) => (
                        <Pressable
                          key={participant.id}
                          style={[
                            styles.pill,
                            { backgroundColor: colors.tint },
                            participant.id === selfParticipant?.id && {
                              opacity: 0.7,
                            },
                          ]}
                          onPress={() =>
                            handleRemoveParticipant(participant.id)
                          }
                          disabled={participant.id === selfParticipant?.id}
                        >
                          <ThemedText style={styles.pillText}>
                            {participant.name}
                          </ThemedText>
                          {participant.id !== selfParticipant?.id && (
                            <IconSymbol name="xmark" size={12} color="#fff" />
                          )}
                        </Pressable>
                      ))
                    ) : (
                      <ThemedText
                        style={{
                          color: colors.secondaryText,
                          fontSize: 13,
                          fontStyle: "italic",
                        }}
                      >
                        Nenhum participante selecionado além de você.
                      </ThemedText>
                    )}
                  </View>
                </View>

                {/* Seção: Busca */}
                <View>
                  <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
                    Buscar usuários
                  </ThemedText>
                  <ThemedTextInput
                    placeholder={`Digite nome ou email...`}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    returnKeyType="search"
                    style={{ marginBottom: 8 }}
                  />

                  {/* Resultados da Busca */}
                  <View
                    style={[styles.resultsBox, { borderColor: colors.border }]}
                  >
                    {searching ? (
                      <View style={styles.centerRow}>
                        <ActivityIndicator size="small" color={colors.tint} />
                        <ThemedText style={{ color: colors.secondaryText }}>
                          Buscando...
                        </ThemedText>
                      </View>
                    ) : filteredResults.length > 0 ? (
                      <ScrollView
                        nestedScrollEnabled
                        style={{ maxHeight: 200 }}
                      >
                        {filteredResults.map((result) => {
                          const isSelected = selectedIds.has(result.id);
                          return (
                            <Card.Root
                              key={result.id}
                              style={{
                                marginVertical: 4,
                                borderColor: isSelected
                                  ? colors.tint
                                  : "transparent",
                                borderWidth: 1,
                              }}
                              onPress={() => handleAddParticipant(result)}
                            >
                              <Card.Avatar uri={undefined} />
                              <Card.Title
                                title={result.name}
                                subtitle={result.userType}
                              />
                              {isSelected ? (
                                <IconSymbol
                                  name="checkmark.circle.fill"
                                  color={colors.tint}
                                  size={20}
                                />
                              ) : (
                                <IconSymbol
                                  name="plus.circle"
                                  color={colors.icon}
                                  size={20}
                                />
                              )}
                            </Card.Root>
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <View style={styles.centerRow}>
                        <ThemedText
                          style={{
                            color: colors.secondaryText,
                            textAlign: "center",
                          }}
                        >
                          {searchTerm.length < MIN_SEARCH_LENGTH
                            ? "Digite para buscar..."
                            : "Nenhum usuário encontrado."}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              /* Passo 2: Detalhes */
              <View style={styles.contentGap}>
                <View>
                  <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
                    Nome do chat
                  </ThemedText>
                  <ThemedTextInput
                    placeholder="Ex.: Acompanhamento da Maria"
                    value={name}
                    onChangeText={setName}
                  />
                  <ThemedText
                    style={{
                      color: colors.secondaryText,
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    Este nome será visível para todos os participantes.
                  </ThemedText>
                </View>

                {/* Resumo visual dos participantes (Opcional) */}
                <View
                  style={[
                    styles.summaryBox,
                    { backgroundColor: colors.secondaryBackground },
                  ]}
                >
                  <ThemedText type="defaultSemiBold">
                    {participants.length} pessoas no grupo
                  </ThemedText>
                  <ThemedText
                    style={{ color: colors.secondaryText, fontSize: 12 }}
                  >
                    Incluindo você.
                  </ThemedText>
                </View>
              </View>
            )}
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
      {/* Footer com Botões Padronizados */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {step === "details" ? (
          <>
            <View style={{ flex: 1 }}>
              <ThemedButton
                title="Voltar"
                type={submitting ? "disabled" : "secondary"}
                onPress={() => setStep("participants")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedButton
                title={submitting ? "Criando..." : "Criar Chat"}
                type={canSubmit ? "primary" : "disabled"}
                onPress={handleSubmit}
              />
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <ThemedButton
                title="Cancelar"
                type="secondary"
                onPress={() => router.back()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedButton
                title="Continuar"
                type={canProceed ? "primary" : "disabled"}
                onPress={goToDetails}
              />
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}

function StepBadge({
  label,
  active,
  index,
  theme,
}: {
  label: string;
  active: boolean;
  index: number;
  theme: "light" | "dark";
}) {
  const colors = Colors[theme];

  const backgroundColor = active ? colors.tint : colors.card;
  const textColor = active ? "#FFFFFF" : colors.secondaryText;
  const borderColor = active ? "transparent" : colors.border;

  return (
    <View
      style={[
        styles.stepBadge,
        { backgroundColor, borderColor, borderWidth: active ? 0 : 1 },
      ]}
    >
      <View
        style={[
          styles.stepCircle,
          { backgroundColor: active ? "rgba(255,255,255,0.2)" : colors.border },
        ]}
      >
        <ThemedText style={[styles.stepIndex, { color: textColor }]}>
          {index}
        </ThemedText>
      </View>
      <ThemedText style={[styles.stepLabel, { color: textColor }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    gap: 4,
  },
  contentGap: {
    gap: 24,
    marginTop: 20,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepDivider: {
    flex: 1,
    height: 1,
  },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndex: {
    fontSize: 10,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Pills
  pillContainer: {
    minHeight: 60,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pillText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  // Search
  resultsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    minHeight: 100,
    marginTop: 8,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  summaryBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
});
