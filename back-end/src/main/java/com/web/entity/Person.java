package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.util.*;

@Entity
@Table(name = "person")
@Getter
@Setter
public class Person {

//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long id;

    @Id
    @Column(name = "person_id", columnDefinition = "VARCHAR(255)")
    private String personId;

    @Column(name="user_name")
    private String username;

    @Column(name="password")
    private String password;


    @Column(name="lastName")
    private String lastName;

    @Column(name="firstName")
    private String firstName;


    @Column(name="actived")
    private Boolean actived;


    @Column(name="phone")
    private String phone;


    @Column(name="email")
    private String email;


    @Column(name="image")
    private String image;


    @Column(name="gender")
    private boolean gender;

    @Column(name="providerId")
    private String providerId;

    @Column(name = "birth_Day")
    @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String birthDay;

    @Column(name = "status")
    private boolean status;

    @OneToMany(mappedBy = "poster", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Comment> comments;

    public Person() {
        super();
    }

    @ManyToOne
    @JoinColumn(name = "authority_name")
    private Authority authorities;

}

