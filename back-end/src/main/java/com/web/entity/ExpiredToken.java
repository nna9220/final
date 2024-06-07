package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "expiredToken")
@Getter
@Setter
public class ExpiredToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiredAt;

    // Constructors, getters, setters
}
