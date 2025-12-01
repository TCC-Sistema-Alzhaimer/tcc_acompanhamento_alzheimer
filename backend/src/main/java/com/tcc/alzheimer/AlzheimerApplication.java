package com.tcc.alzheimer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;


@SpringBootApplication
public class AlzheimerApplication {

	public static void main(String[] args) {

		if (System.getenv("DB_URL") == null) { // Só carrega .env se não tiver var no ambiente
			try {
				Path envPath = Paths.get(".env");
				if (Files.exists(envPath)) {
					Files.lines(envPath, StandardCharsets.UTF_8)
						.map(String::trim)
						.filter(l -> !l.isEmpty() && !l.startsWith("#") && l.contains("="))
						.forEach(l -> {
							int idx = l.indexOf('=');
							String key = l.substring(0, idx).trim();
							String value = l.substring(idx + 1).trim().replaceAll("^\"|\"$", "");
							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, value);
							}
						});
				}
			} catch (Exception ex) {
				// ignore errors loading .env
			}
		}

		SpringApplication.run(AlzheimerApplication.class, args);
	}

}
