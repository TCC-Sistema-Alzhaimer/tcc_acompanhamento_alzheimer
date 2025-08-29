package com.tcc.alzheimer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tcc.alzheimer.model.User;
import com.tcc.alzheimer.repository.UserRepository;

@Component
public class UserTesteRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserTesteRunner(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String email = "teste@gmail.com";
        String rawPassword = "123456";


        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                .email(email)
                .password(encoder.encode(rawPassword))
                .role("USER")
                .build();
            userRepository.save(user);
            System.out.println("Usuário de teste criado.");
        } else {
            System.out.println("Usuário de teste já existe. Não será recriado.");
        }
    }
    
}
