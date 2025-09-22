// app/login.tsx

import { useAuth } from "@/context/AuthContext";
import {
  AuthenticationError,
  NetworkError,
  NotFoundError,
} from "@/services/errors";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin1@gmail.com");
  const [password, setPassword] = useState("senha123");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { useLogin } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await useLogin({
        email,
        password,
      });
      if (response && response.token) {
        if (Platform.OS === "web") {
          localStorage.setItem("userToken", response.token);
        } else {
          await SecureStore.setItemAsync("userToken", response.token);
        }
        router.replace("/home" as any);
      } else {
        throw new Error("Resposta de autenticação inválida");
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        Alert.alert(
          "Erro de Autenticação",
          "A senha está incorreta. Tente novamente"
        );
      } else if (error instanceof NotFoundError) {
        Alert.alert(
          "Usuário não Encontrado",
          "Este e-mail não está cadastrado em nosso sistema"
        );
      } else if (error instanceof NetworkError) {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor. Verifique sua internet"
        );
      } else {
        Alert.alert(
          "Erro",
          "Ocorreu um erro inesperado. Tente novamente mais tarde"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="seuemail@exemplo.com"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
        />

        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: "#007AFF",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4FD1C5",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
