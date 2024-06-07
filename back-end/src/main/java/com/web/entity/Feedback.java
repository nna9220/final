package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="feedback_id")
    private int feedbackId;

    @Column(name="content")
    private String content;

    @Column(name="title")
    private String title;

    @OneToOne
    @JoinColumn(name = "contact", unique = true)
    @JsonIgnore
    private Contact contact;

    @Column(name = "time")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime time;
}
