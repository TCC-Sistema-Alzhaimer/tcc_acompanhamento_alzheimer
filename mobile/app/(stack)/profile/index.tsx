import { Card } from "@/components/card/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "@/hooks/useSession";
import {
  ProfileFormData,
  fetchProfile,
  updateProfile,
} from "@/services/profile-service";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type EmailListKey = "patientEmails" | "doctorEmails" | "caregiverEmails";

const EMAIL_SEPARATOR = ",";

export default function ProfileScreen() {
  const session = useSession();
  const { loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLists, setEmailLists] = useState<Record<EmailListKey, string>>({
    patientEmails: "",
    doctorEmails: "",
    caregiverEmails: "",
  });

  const shouldShowPatientEmails = false;
  const shouldShowDoctorEmails = profile?.role === Roles.PATIENT;
  const shouldShowCaregiverEmails = profile?.role === Roles.PATIENT;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!session) {
        setProfile(null);
        return;
      }

      try {
        setLoadingProfile(true);
        const data = await fetchProfile({
          userId: session.user.id,
          role: session.user.role,
          accessToken: session.accessToken,
        });

        if (cancelled) return;

        setProfile(data);
        setEmailLists({
          patientEmails: (data.patientEmails ?? []).join(`${EMAIL_SEPARATOR} `),
          doctorEmails: (data.doctorEmails ?? []).join(`${EMAIL_SEPARATOR} `),
          caregiverEmails: (data.caregiverEmails ?? []).join(
            `${EMAIL_SEPARATOR} `
          ),
        });
        setErrors({});
      } catch (error) {
        console.error("Failed to load profile", error);
        Alert.alert(
          "Erro",
          "Nao foi possivel carregar seus dados. Tente novamente."
        );
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [session?.user.id, session?.user.role, session?.accessToken]);

  const updateField = useCallback(
    <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
      setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const handleEmailListChange = useCallback(
    (key: EmailListKey, text: string) => {
      setEmailLists((prev) => ({ ...prev, [key]: text }));
      const list = text
        .split(EMAIL_SEPARATOR)
        .map((item) => item.trim())
        .filter(Boolean);

      updateField(key, list);
    },
    [updateField]
  );

  const validate = useCallback(() => {
    if (!profile) {
      return false;
    }

    const nextErrors: Record<string, string> = {};
    if (!profile.name?.trim()) {
      nextErrors.name = "Informe seu nome.";
    }

    const email = profile.email?.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      nextErrors.email = "Informe um email valido.";
    }

    if (profile.role !== Roles.ADMINISTRATOR && !profile.phone?.trim()) {
      nextErrors.phone = "Informe um telefone.";
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        nextErrors.newPassword = "A senha precisa ter pelo menos 6 caracteres.";
      }
      if (newPassword !== confirmPassword) {
        nextErrors.confirmPassword = "As senhas nao coincidem.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [confirmPassword, newPassword, profile]);

  const handleSave = useCallback(async () => {
    if (!profile || !session) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        accessToken: session.accessToken,
        form: profile,
        password: newPassword || undefined,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update profile", error);
      Alert.alert("Erro", "Nao foi possivel salvar as alteracoes.");
    } finally {
      setSaving(false);
    }
  }, [newPassword, profile, session, validate]);

  const formattedRole = useMemo(() => {
    if (!profile) {
      return "";
    }

    switch (profile.role) {
      case Roles.DOCTOR:
        return "Medico";
      case Roles.CAREGIVER:
        return "Cuidador";
      case Roles.PATIENT:
        return "Paciente";
      case Roles.ADMINISTRATOR:
        return "Administrador";
      default:
        return profile.role;
    }
  }, [profile]);

  if (authLoading || loadingProfile) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!session || !profile) {
    return (
      <ThemedView style={styles.centered}>
        <Card.Root
          themed
          onPress={() => router.push("/login")}
          style={styles.loginCard}
        >
          <Card.Title
            title="Realize o login"
            subtitle="Sua sessao expirou. Toque para retornar ao login."
          />
        </Card.Root>
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
          <ThemedText type="title">Perfil</ThemedText>
          <ThemedText type="subtitle">{formattedRole}</ThemedText>
        </View>

        <Card.Root themed style={styles.section}>
          <Card.Title title="Dados pessoais" />
          <View style={styles.fieldGroup}>
            <ThemedTextInput
              label="Nome completo"
              value={profile.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Informe seu nome"
              error={errors.name}
            />
            <ThemedTextInput
              label="Email"
              value={profile.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="email@exemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />
            {profile.cpf ? (
              <ThemedTextInput
                label="CPF"
                value={profile.cpf}
                onChangeText={(text) => updateField("cpf", text)}
                placeholder="000.000.000-00"
              />
            ) : null}
          </View>
        </Card.Root>

        <Card.Root themed style={styles.section}>
          <Card.Title title="Contato" />
          <View style={styles.fieldGroup}>
            <ThemedTextInput
              label="Telefone"
              value={profile.phone ?? ""}
              onChangeText={(text) => updateField("phone", text)}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              error={errors.phone}
            />
            {profile.address !== undefined ? (
              <ThemedTextInput
                label="Endereco"
                value={profile.address ?? ""}
                onChangeText={(text) => updateField("address", text)}
                placeholder="Rua, numero, bairro"
              />
            ) : null}
            {profile.birthdate !== undefined ? (
              <ThemedTextInput
                label="Data de nascimento"
                value={profile.birthdate ?? ""}
                onChangeText={(text) => updateField("birthdate", text)}
                placeholder="AAAA-MM-DD"
              />
            ) : null}
            {profile.gender !== undefined ? (
              <ThemedTextInput
                label="Genero"
                value={profile.gender ?? ""}
                onChangeText={(text) => updateField("gender", text)}
                placeholder="MASCULINO, FEMININO..."
                autoCapitalize="characters"
              />
            ) : null}
          </View>
        </Card.Root>

        {profile.role === Roles.DOCTOR ? (
          <Card.Root themed style={styles.section}>
            <Card.Title title="Informacoes profissionais" />
            <View style={styles.fieldGroup}>
              <ThemedTextInput
                label="CRM"
                value={profile.crm ?? ""}
                onChangeText={(text) => updateField("crm", text)}
                placeholder="CRM"
              />
              <ThemedTextInput
                label="Especialidade"
                value={profile.speciality ?? ""}
                onChangeText={(text) => updateField("speciality", text)}
                placeholder="Especialidade principal"
              />
            </View>
          </Card.Root>
        ) : null}

        {shouldShowPatientEmails ? (
          <Card.Root themed style={styles.section}>
            <Card.Title title="Pacientes vinculados" />
            <ThemedTextInput
              multiline
              numberOfLines={3}
              value={emailLists.patientEmails}
              onChangeText={(text) =>
                handleEmailListChange("patientEmails", text)
              }
              style={{ minHeight: 60, width: "100%" }}
              placeholder="emails separados por virgula"
            />
          </Card.Root>
        ) : null}

        {shouldShowDoctorEmails ? (
          <Card.Root themed style={styles.section}>
            <Card.Title title="Medicos vinculados" />
            <ThemedTextInput
              multiline
              numberOfLines={3}
              value={emailLists.doctorEmails}
              onChangeText={(text) =>
                handleEmailListChange("doctorEmails", text)
              }
              placeholder="emails separados por virgula"
            />
          </Card.Root>
        ) : null}

        {shouldShowCaregiverEmails ? (
          <Card.Root themed style={styles.section}>
            <Card.Title title="Cuidadores vinculados" />
            <ThemedTextInput
              multiline
              numberOfLines={3}
              value={emailLists.caregiverEmails}
              onChangeText={(text) =>
                handleEmailListChange("caregiverEmails", text)
              }
              placeholder="emails separados por virgula"
            />
          </Card.Root>
        ) : null}

        <Card.Root themed style={styles.section}>
          <Card.Title title="Seguranca" />
          <View style={styles.fieldGroup}>
            <ThemedTextInput
              label="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Informe a nova senha"
              secureTextEntry
              error={errors.newPassword}
            />
            <ThemedTextInput
              label="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita a nova senha"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>
        </Card.Root>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.saveButtonText}>
              Salvar alteracoes
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    gap: 4,
  },
  section: {
    flexDirection: "column",
    gap: 16,
  },
  fieldGroup: {
    width: "100%",
    gap: 12,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#4FD1C5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loginCard: {
    maxWidth: 320,
  },
});
