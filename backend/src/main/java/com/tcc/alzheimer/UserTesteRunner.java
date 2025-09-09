package com.tcc.alzheimer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.roles.Administrator;
import com.tcc.alzheimer.repository.roles.AdministratorRepository;

@Component
public class UserTesteRunner implements CommandLineRunner {

    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder encoder;

    public UserTesteRunner(AdministratorRepository administratorRepository, PasswordEncoder encoder) {
        this.administratorRepository = administratorRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String email = "admin@gmail.com";
        String rawPassword = "123456";

        if (administratorRepository.findByEmail(email).isEmpty()) {
            Administrator admin = new Administrator();
            admin.setCpf("12345678900");
            admin.setName("Administrador do Sistema");
            admin.setEmail(email);
            admin.setPhone("11999999999");
            admin.setPassword(encoder.encode(rawPassword));
            admin.setType(UserType.ADMINISTRATOR);

            administratorRepository.save(admin);
            System.out.println("Administrador de teste criado.");
        } else {
            System.out.println("Administrador já existe. Não será recriado.");
        }
    }
}
