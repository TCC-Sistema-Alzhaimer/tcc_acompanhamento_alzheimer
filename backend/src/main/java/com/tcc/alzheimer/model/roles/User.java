package com.tcc.alzheimer.model.roles;
import java.util.HashSet;
import java.util.Set;

import com.tcc.alzheimer.model.enums.UserType;
import com.tcc.alzheimer.model.notifications.NotificationRecipient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cpf", nullable = false, unique = true)
    @NotBlank
    private String cpf;

    @Column(name = "name", nullable = false)
    @NotBlank
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    @NotBlank
    private String email;

    @Column(name = "phone", nullable = false)
    @NotBlank
    private String phone;

    @Column(name = "password", nullable = false)
    @NotBlank
    private String password;

    @Column(name = "active")
    private Boolean active;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private UserType type;

    @OneToMany(mappedBy = "recipient")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<NotificationRecipient> received = new HashSet<>();
}


