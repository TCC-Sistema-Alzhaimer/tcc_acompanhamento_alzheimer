import { Card } from "@/components/card/Card";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useSelectedPatient } from "@/context/SelectedPatientContext";
import { useSession } from "@/hooks/useSession";
import {
  fetchNotificationsByPatient,
  markNotificationAsRead,
} from "@/services/notification-service";
import { Notification } from "@/types/domain/notification";
import { parseNotification } from "@/util/parser";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

export default function NotificationScreen() {
  const [patientNotifications, setPatientNotifications] = useState<
    Notification[] | null
  >();

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();
  const session = useSession();
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
              console.log(resp);
              const parses: Notification[] = resp.map((n) =>
                parseNotification(n)
              );
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
    console.log("Handling navigation for notification:", notification);
    if (notification.examId != null) {
      await markNotificationAsRead({
        accessToken: session?.accessToken || "",
        notificationId: String(notification.id),
      });
      router.push(`/exam/${notification.examId}`);
    } else if (notification.associationId != null) {
      await markNotificationAsRead({
        accessToken: session?.accessToken || "",
        notificationId: String(notification.id),
      });
      router.push(`/association/${notification.associationId}`);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ScrollView>
          {patientNotifications ? (
            patientNotifications.map((n) => (
              <Card.Root
                key={n.id!.toString()}
                style={{
                  marginBottom: 10,
                  backgroundColor: n.read ? colors.card : colors.background,
                }}
                onPress={() =>
                  handleNavigation({
                    notification: n,
                  })
                }
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
        </ScrollView>
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
