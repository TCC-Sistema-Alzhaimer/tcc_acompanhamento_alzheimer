import { Card } from "@/components/card/Card";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "@/hooks/useSession";
import {
  fetchProfile,
  ProfileFormData,
  updateProfile,
} from "@/services/profile-service";
import { Roles } from "@/types/enum/roles";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type EmailListKey = "patientEmails" | "doctorEmails" | "caregiverEmails";

const EMAIL_SEPARATOR = ",";

export default function ProfileScreen() {
  const session = useSession();
  const { loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

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
        if (session.user.id == null || session.user.role == null) {
          throw new Error("User ID or role is null");
        }
        const data = await fetchProfile({
          userId: session.user.id as number,
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={{ alignItems: "center", gap: 4 }}>
              <ThemedText type="title">{profile.name}</ThemedText>
              <ThemedText style={{ color: colors.secondaryText, fontSize: 14 }}>
                {profile.email} • {formattedRole}
              </ThemedText>
            </View>
          </View>

          <View style={styles.formGap}>
            {/* Seção Pessoal */}
            <Card.Root style={styles.formCard}>
              <Card.Title
                title="Dados pessoais"
                subtitle="Informações básicas da conta"
              />
              <View style={styles.fieldGroup}>
                <ThemedTextInput
                  label="Nome completo"
                  value={profile.name}
                  onChangeText={(text) => updateField("name", text)}
                  placeholder="Seu nome"
                  error={errors.name}
                />
                <ThemedTextInput
                  label="Email"
                  value={profile.email}
                  onChangeText={(text) => updateField("email", text)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email}
                />
                {profile.cpf && (
                  <ThemedTextInput
                    label="CPF"
                    value={profile.cpf}
                    editable={false} // Geralmente CPF não muda
                    style={{ opacity: 0.6 }}
                  />
                )}
              </View>
            </Card.Root>

            {/* Seção Contato */}
            <Card.Root style={styles.formCard}>
              <Card.Title
                title="Contato & Endereço"
                subtitle="Para comunicação e localização"
              />
              <View style={styles.fieldGroup}>
                <ThemedTextInput
                  label="Telefone"
                  value={profile.phone ?? ""}
                  onChangeText={(text) => updateField("phone", text)}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
                {profile.address !== undefined && (
                  <ThemedTextInput
                    label="Endereço"
                    value={profile.address ?? ""}
                    onChangeText={(text) => updateField("address", text)}
                    placeholder="Rua, número..."
                  />
                )}
                <View style={styles.row}>
                  {profile.birthdate !== undefined && (
                    <View style={{ flex: 1 }}>
                      <ThemedTextInput
                        label="Nascimento"
                        value={profile.birthdate ?? ""}
                        onChangeText={(text) => updateField("birthdate", text)}
                        placeholder="AAAA-MM-DD"
                      />
                    </View>
                  )}
                  {profile.gender !== undefined && (
                    <View style={{ flex: 1 }}>
                      <ThemedTextInput
                        label="Gênero"
                        value={profile.gender ?? ""}
                        onChangeText={(text) => updateField("gender", text)}
                        placeholder="M/F"
                      />
                    </View>
                  )}
                </View>
              </View>
            </Card.Root>

            {/* Seção Profissional (Médico) */}
            {profile.role === Roles.DOCTOR && (
              <Card.Root style={styles.formCard}>
                <Card.Title
                  title="Profissional"
                  subtitle="Dados do CRM e Especialidade"
                />
                <View style={styles.fieldGroup}>
                  <ThemedTextInput
                    label="CRM"
                    value={profile.crm ?? ""}
                    onChangeText={(text) => updateField("crm", text)}
                  />
                  <ThemedTextInput
                    label="Especialidade"
                    value={profile.speciality ?? ""}
                    onChangeText={(text) => updateField("speciality", text)}
                  />
                </View>
              </Card.Root>
            )}

            {/* Seções de Email (Vínculos) */}
            {(shouldShowPatientEmails ||
              shouldShowDoctorEmails ||
              shouldShowCaregiverEmails) && (
              <Card.Root style={styles.formCard}>
                <Card.Title
                  title="Vínculos"
                  subtitle="Emails separados por vírgula"
                />
                <View style={styles.fieldGroup}>
                  {shouldShowPatientEmails && (
                    <ThemedTextInput
                      label="Pacientes vinculados"
                      multiline
                      numberOfLines={3}
                      value={emailLists.patientEmails}
                      onChangeText={(t) =>
                        handleEmailListChange("patientEmails", t)
                      }
                      style={{ minHeight: 80, textAlignVertical: "top" }}
                    />
                  )}
                  {shouldShowDoctorEmails && (
                    <ThemedTextInput
                      label="Médicos vinculados"
                      multiline
                      numberOfLines={3}
                      value={emailLists.doctorEmails}
                      onChangeText={(t) =>
                        handleEmailListChange("doctorEmails", t)
                      }
                      style={{ minHeight: 80, textAlignVertical: "top" }}
                    />
                  )}
                  {shouldShowCaregiverEmails && (
                    <ThemedTextInput
                      label="Cuidadores vinculados"
                      multiline
                      numberOfLines={3}
                      value={emailLists.caregiverEmails}
                      onChangeText={(t) =>
                        handleEmailListChange("caregiverEmails", t)
                      }
                      style={{ minHeight: 80, textAlignVertical: "top" }}
                    />
                  )}
                </View>
              </Card.Root>
            )}

            {/* Seção Segurança */}
            <Card.Root style={styles.formCard}>
              <Card.Title
                title="Segurança"
                subtitle="Deixe em branco para manter a atual"
              />
              <View style={styles.fieldGroup}>
                <ThemedTextInput
                  label="Nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••"
                  secureTextEntry
                  error={errors.newPassword}
                />
                <ThemedTextInput
                  label="Confirmar senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••"
                  secureTextEntry
                  error={errors.confirmPassword}
                />
              </View>
            </Card.Root>

            {/* Botão de Salvar Padronizado */}
            <View style={{ marginTop: 8 }}>
              <ThemedButton
                title={saving ? "Salvando..." : "Salvar alterações"}
                onPress={handleSave}
                type={saving ? "disabled" : "primary"}
              >
                {!saving && (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    color="#FFF"
                    size={18}
                  />
                )}
              </ThemedButton>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  formGap: {
    gap: 20, // Espaçamento entre Cards
  },
  formCard: {
    flexDirection: "column", // Muda de linha para coluna
    alignItems: "stretch", // Estica os filhos (inputs) para ocupar largura total
    gap: 16, // Espaço entre o título e os inputs
  },
  fieldGroup: {
    gap: 12,
    marginTop: 0, // Removido margin extra, controlado pelo gap do pai
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  loginCard: {
    maxWidth: 320,
    width: "100%",
  },
});
