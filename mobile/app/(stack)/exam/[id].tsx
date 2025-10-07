import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ExamMock } from "@/mocks/exam-mocks";
import { Exam } from "@/types/domain/exam";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function ExamScreen() {
  const { id } = useLocalSearchParams();

  const [exam, setExam] = useState<Exam | null>(null);

  const loadExam = () => {
    const examData = ExamMock.find((ex) => String(ex.id) === String(id));
    setExam(examData || null);
  };

  useEffect(() => {
    loadExam();
  }, [id]);

  return (
    <ThemedView style={styles.container} type="default">
      {exam && (
        <ThemedView style={styles.content} type="secondary">
          <ThemedText>
            Solicitado Dia: {exam.requestDate.split("T")[0]}
          </ThemedText>
          <ThemedText>Status: {exam.status.description}</ThemedText>
          <ThemedText>Exame: {exam.type.description}</ThemedText>
          <ThemedText>Anotacoes: {exam.note}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: {
    gap: 12,
    alignContent: "center",
    padding: 16,
  },
});
