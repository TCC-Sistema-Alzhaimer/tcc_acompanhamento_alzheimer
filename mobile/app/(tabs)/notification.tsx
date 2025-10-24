import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import {
  fetchNotificationsByPatient,
  markNotificationAsRead,
} from "@/services/notification-service";
import { Notification } from "@/types/domain/notification";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function NotificationScreen() {
  const [patientNotifications, setPatientNotifications] = useState<
    Notification[] | null
  >();

  const router = useRouter();
  const session = useSession();
  const { user } = useAuth();
  const { state, loading } = useSelectedPatient();

  useEffect(() => {
    if (loading) return;
    const fetchNotifications = async () => {
      if (session !== null && state.patientId) {
        try {
          fetchNotificationsByPatient({
            accessToken: session.accessToken,
            patientId: state.patientId,
          })
            .then((resp) => {
              const parses: Notification[] = resp.map((n) => ({
                ...n,
                createdAt: n.createdAt
                  ? new Date(n.createdAt).toLocaleString()
                  : undefined,
              }));
              setPatientNotifications(parses);
            })
            .catch((error) => {
              console.error("Erro ao carregar notificações:", error);
              setPatientNotifications(null);
            });
        } catch (error) {
          console.error("Erro ao carregar notificações:", error);
          setPatientNotifications(null);
        }
      }
    };
    fetchNotifications();
  }, [loading, state.patientId]);

  const handleNavigation = async ({
    notification,
  }: {
    notification: Notification;
  }) => {
    if (notification.examId != null) {
      await markNotificationAsRead({
        accessToken: session?.accessToken || "",
        notificationId: String(notification.id),
        readerId: String(user?.id || 0),
      });
      router.push(`/exam/${notification.examId}`);
    } else if (notification.associationId != null) {
      await markNotificationAsRead({
        accessToken: session?.accessToken || "",
        notificationId: String(notification.id),
        readerId: String(user?.id || 0),
      });
      router.push(`/association/${notification.associationId}`);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {patientNotifications ? (
          patientNotifications.map((n) => (
            <Card.Root
              key={n.id!.toString()}
              style={{ marginBottom: 10 }}
              onPress={() =>
                handleNavigation({
                  notification: n,
                })
              }
              themed={(() => {
                const recipient = n.recipients.find((r) => r.id === user?.id);
                if (!recipient) return true;
                if (recipient.read === undefined) return true;
                return !recipient.read;
              })()}
            >
              <Card.Title title={n.title} subtitle={n.message} />
              <Card.Icon name="paperplane.fill" />
            </Card.Root>
          ))
        ) : (
          <Card.Title
            title="Sem notificação"
            subtitle="Nenhuma notificação disponível."
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 12,
    alignContent: "center",
    justifyContent: "flex-start",
    padding: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
  },
});
