package com.tcc.alzheimer.dto.roles;

import com.tcc.alzheimer.model.enums.UserType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BasicDtoForList {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserType userType;
}
