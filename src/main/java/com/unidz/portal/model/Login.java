package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "login")
@Getter @Setter
public class Login {
    @Id
    private Integer id;
    private String username;
    private String password;
}