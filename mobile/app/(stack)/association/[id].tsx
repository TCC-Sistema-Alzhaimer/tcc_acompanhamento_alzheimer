import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/hooks/useSession";
import {
  fetchAssociationById,
  respondToAssociationRequest,
} from "@/services/association-service";
import { AssociationResponseDto } from "@/types/api/association";
import { RequestStatus } from "@/types/enum/exam-status";
import { Roles } from "@/types/enum/roles";
import { formatAssociationType } from "@/util/format";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string | null;
}

export default function AssociationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [association, setAssociation] = useState<AssociationResponseDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const session = useSession();

  useEffect(() => {
    if (!session?.accessToken || !id) {
      return;
    }

    const accessToken = session.accessToken;
    const associationId = id as string;
    let isActive = true;

    const loadAssociation = async () => {
      if (!isActive) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchAssociationById({
          accessToken,
          associationId,
        });
        console.log("Fetched association:", resp);
        if (!isActive) {
          return;
        }
        if (!resp) {
          setError("Associação não encontrada.");
          setAssociation(null);
        } else {
          setAssociation(resp);
        }
      } catch (err) {
        console.error("Erro ao carregar associação:", err);
        if (isActive) {
          setError("Não foi possível carregar a associação no momento.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadAssociation();

    return () => {
      isActive = false;
    };
  }, [session?.accessToken, id]);

  const isCaregiver = session?.user?.role === Roles.CAREGIVER;

  const statusLabel = useMemo(() => {
    if (!association?.status) {
      return "--";
    }
    const mappings: Record<string, string> = {
      ACEITA: "Aceita",
      PENDENTE: "Pendente",
      RECUSADA: "Recusada",
      CANCELADA: "Cancelada",
    };
    return mappings[association.status] ?? association.status;
  }, [association?.status]);

  const statusColor = useMemo(() => {
    switch (association?.status) {
      case "ACEITA":
        return "#2ECC71";
      case "PENDENTE":
        return "#F1C40F";
      case "RECUSADA":
        return "#E74C3C";
      case "CANCELADA":
        return "#7F8C8D";
      default:
        return "#4E46E5";
    }
  }, [association?.status]);

  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!association) {
      return [];
    }

    const items: TimelineItem[] = [
      {
        id: "created",
        title: "Solicitação criada",
        description: `Criada por ${association.creatorEmail}`,
        timestamp: association.createdAt,
      },
    ];

    if (association.respondedAt) {
      items.push({
        id: "responded",
        title:
          association.status === "ACEITA"
            ? "Solicitação aceita"
            : association.status === "RECUSADA"
            ? "Solicitação recusada"
            : "Resposta registrada",
        description: association.responderEmail
          ? `Respondida por ${association.responderEmail}`
          : "Resposta registrada",
        timestamp: association.respondedAt,
      });
    } else {
      items.push({
        id: "pending",
        title: "Aguardando resposta",
        description: "Nenhuma ação final registrada até o momento.",
        timestamp: null,
      });
    }

    return items;
  }, [association]);

  const handleAction = async (action: string) => {
    const status =
      action === "Aceitar solicitação"
        ? RequestStatus.ACEITA
        : action === "Recusar solicitação"
        ? RequestStatus.RECUSADA
        : null;
    if (!status) {
      return;
    }
    respondToAssociationRequest({
      accessToken: session!.accessToken,
      associationId: association!.id,
      responderEmail: session!.user.email,
      status,
    })
      .then(() => {
        setAssociation((prev) =>
          prev
            ? { ...prev, status: status, respondedAt: new Date().toISOString() }
            : prev
        );
      })
      .catch((err) => {
        console.error("Erro ao responder à solicitação de associação:", err);
      });
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return "—";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }
    try {
      return parsed.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return parsed.toISOString();
    }
  };

  if (loading && !association) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#4E46E5" />
        <ThemedText style={styles.centeredText}>
          Carregando detalhes da associação...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="title">Ops!</ThemedText>
        <ThemedText style={styles.centeredText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!association) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.centeredText}>
          Ainda estamos buscando essa associação. Tente novamente mais tarde.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title">Detalhes da associação</ThemedText>
          <View style={styles.statusWrapper}>
            <ThemedText style={styles.subtitle}>
              Tipo: {formatAssociationType(association.type)}
            </ThemedText>
            <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
              <ThemedText style={styles.statusChipText}>
                {statusLabel}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Participantes</ThemedText>
          <View style={styles.participantRow}>
            <View style={styles.participantInfo}>
              <ThemedText style={styles.participantLabel}>Paciente</ThemedText>
              <ThemedText style={styles.participantName}>
                {association.patient.name}
              </ThemedText>
              <ThemedText style={styles.participantEmail}>
                {association.patient.email}
              </ThemedText>
            </View>
            <View style={styles.participantDivider} />
            <View style={styles.participantInfo}>
              <ThemedText style={styles.participantLabel}>Relação</ThemedText>
              <ThemedText style={styles.participantName}>
                {association.relation.name}
              </ThemedText>
              <ThemedText style={styles.participantEmail}>
                {association.relation.email}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Informações gerais</ThemedText>
          <View style={[styles.infoRow, styles.infoRowFirst]}>
            <ThemedText style={styles.infoLabel}>Criada em</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDateTime(association.createdAt)}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Respondida em</ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDateTime(association.respondedAt)}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Criador</ThemedText>
            <ThemedText style={styles.infoValue}>
              {association.creatorEmail}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Respondedor</ThemedText>
            <ThemedText style={styles.infoValue}>
              {association.responderEmail ?? "—"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle">Linha do tempo</ThemedText>
          <View style={styles.timeline}>
            {timelineItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.timelineItem,
                  index > 0 && styles.timelineItemSpacing,
                ]}
              >
                <View style={styles.timelineBulletWrapper}>
                  <View style={styles.timelineBullet} />
                  {index < timelineItems.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.timelineDescription}>
                    {item.description}
                  </ThemedText>
                  <ThemedText style={styles.timelineTimestamp}>
                    {formatDateTime(item.timestamp)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {isCaregiver ? (
          association.status === "PENDENTE" ? (
            <View style={styles.card}>
              <ThemedText type="subtitle">Ações rápidas</ThemedText>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.firstActionButton,
                  styles.acceptAction,
                ]}
                onPress={() => handleAction("Aceitar solicitação")}
              >
                <ThemedText style={styles.actionText}>
                  Aceitar solicitação
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineAction]}
                onPress={() => handleAction("Recusar solicitação")}
              >
                <ThemedText style={styles.actionText}>
                  Recusar solicitação
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <ThemedText type="subtitle">Próximos passos</ThemedText>
              <ThemedText style={styles.helperText}>
                A associação foi respondida. Você pode gerenciar suas
                associações na seção apropriada do aplicativo.
              </ThemedText>
            </View>
          )
        ) : (
          <View style={styles.card}>
            <ThemedText type="subtitle">Próximos passos</ThemedText>
            <ThemedText style={styles.helperText}>
              Aguardando resposta do cuidador responsável. Você será avisado
              automaticamente assim que houver uma atualização.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  centeredText: {
    marginTop: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 16,
  },
  statusWrapper: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statusChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 16,
  },
  participantInfo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  participantLabel: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  participantEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  participantDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  infoRowFirst: {
    marginTop: 16,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  timeline: {
    marginTop: 12,
  },
  timelineItem: {
    flexDirection: "row",
  },
  timelineItemSpacing: {
    marginTop: 18,
  },
  timelineBulletWrapper: {
    width: 24,
    alignItems: "center",
  },
  timelineBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4E46E5",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(78, 70, 229, 0.3)",
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  timelineTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  timelineDescription: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 2,
  },
  timelineTimestamp: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },
  helperText: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  firstActionButton: {
    marginTop: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  acceptAction: {
    backgroundColor: "#1ABC9C",
  },
  declineAction: {
    backgroundColor: "#E74C3C",
  },
  cancelAction: {
    backgroundColor: "#F39C12",
  },
  quickAction: {
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  quickActionFirst: {
    marginTop: 16,
  },
  quickActionPrimary: {
    backgroundColor: "rgba(78, 70, 229, 0.18)",
  },
  quickActionSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickActionDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
});
