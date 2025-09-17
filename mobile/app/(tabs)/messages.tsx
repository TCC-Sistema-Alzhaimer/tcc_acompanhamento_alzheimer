import { Card } from "@/components/card/Card";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { DoctorMocks } from "@/mocks/doctor-mock";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function MessagesScreen() {
  const [doctorsList, setDoctorsList] = useState(DoctorMocks);
  const [filteredDoctors, setFilteredDoctors] = useState(DoctorMocks);
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim() === "") {
      setFilteredDoctors(doctorsList);
      return;
    }
    const filtered = doctorsList.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Card.Root themed={false} style={styles.search}>
          <ThemedTextInput
            placeholder="Buscar"
            style={{ width: "100%" }}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleSearch}
          />
          <Card.Icon name="magnifyingglass" onPress={handleSearch} />
        </Card.Root>
      </View>

      <View style={styles.content}>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {filteredDoctors.map((doctor) => (
            <Card.Root
              key={doctor.id}
              style={styles.card}
              themed={false}
              onPress={() => console.log(`Card ${doctor.name} pressed`)}
            >
              <Card.Avatar uri="https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Avatar-Fogo-e-Cinzas.png?w=1200&h=900&crop=0" />
              <Card.Title title={doctor.name} subtitle={doctor.role} />
              <Card.Icon name="chevron.right" />
            </Card.Root>
          ))}
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
  header: {
    flex: 0.2,
    marginBottom: 16,
    justifyContent: "center",
    borderColor: "#555",
  },
  content: {
    flex: 1,
    gap: 12,
    alignContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
  },

  search: {
    width: "100%",
  },
  listContent: {
    gap: 12,
    alignItems: "center",
    paddingBottom: 16,
  },
  card: {
    width: "100%",
    marginBottom: 12,
  },
});
