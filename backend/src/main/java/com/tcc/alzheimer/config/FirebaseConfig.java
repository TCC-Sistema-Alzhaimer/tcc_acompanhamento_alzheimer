package com.tcc.alzheimer.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.bucket-name}")
    private String bucketName;

    @Value("${firebase.private-key}")
    private String privateKey;

    @Value("${firebase.client-email}")
    private String clientEmail;

    @Value("${firebase.client-id}")
    private String clientId;

    @Value("${firebase.private-key-id}")
    private String privateKeyId;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                // Criar JSON das credenciais a partir das variáveis de ambiente
                String credentialsJson = buildCredentialsJson();
                ByteArrayInputStream credentialsStream = new ByteArrayInputStream(credentialsJson.getBytes());

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                        .setProjectId(projectId)
                        .setStorageBucket(bucketName)
                        .build();

                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao inicializar Firebase", e);
        }
    }

    @Bean
    public Bucket firebaseStorageBucket() {
        return StorageClient.getInstance().bucket();
    }

    @Bean
    public Storage googleCloudStorage() throws IOException {
        String credentialsJson = buildCredentialsJson();
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(credentialsJson.getBytes());

        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
        return StorageOptions.newBuilder()
                .setCredentials(credentials)
                .setProjectId(projectId)
                .build()
                .getService();
    }

    /**
     * Constrói o JSON de credenciais do Firebase a partir das variáveis de ambiente
     */
    private String buildCredentialsJson() {
        return String.format("{"
                + "\"type\": \"service_account\","
                + "\"project_id\": \"%s\","
                + "\"private_key_id\": \"%s\","
                + "\"private_key\": \"%s\","
                + "\"client_email\": \"%s\","
                + "\"client_id\": \"%s\","
                + "\"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\","
                + "\"token_uri\": \"https://oauth2.googleapis.com/token\","
                + "\"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\","
                + "\"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/%s\""
                + "}",
                projectId,
                privateKeyId,
                privateKey.replace("\\n", "\n"), // Converter \\n para \n real
                clientEmail,
                clientId,
                clientEmail.replace("@", "%40") // URL encode do @ para a cert URL
        );
    }
}