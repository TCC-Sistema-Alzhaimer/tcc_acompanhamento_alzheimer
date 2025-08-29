package com.tcc.alzheimer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class AlzheimerApplication {

	public static void main(String[] args) {

		if (System.getenv("DB_URL") == null) { // Só carrega .env se não tiver var no ambiente
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
        }

		SpringApplication.run(AlzheimerApplication.class, args);
	}

}
