import { ExamStatus as ExamStatusEnum } from "@/types/enum/exam-status";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ExamStatusProps {
  status: string | undefined;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case ExamStatusEnum.COMPLETED:
      return "#10B981";
    case ExamStatusEnum.REQUESTED:
      return "#3B82F6";
    case ExamStatusEnum.SCHEDULED:
      return "#6366F1";
    case ExamStatusEnum.IN_PROGRESS:
      return "#F59E0B";
    case ExamStatusEnum.PENDING_RESULT:
      return "#8B5CF6";
    case ExamStatusEnum.CANCELLED:
      return "#EF4444";
    default:
      return "#64748B";
  }
};

export function ExamStatus({ status }: ExamStatusProps) {
  if (!status) {
    return null;
  }

  const backgroundColor = getStatusColor(status);

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText style={styles.text}>{status}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
