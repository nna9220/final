package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import javax.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@ToString
@Entity
@Table(name = "notification")
@NoArgsConstructor
@AllArgsConstructor
public class Notification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notification_id")
    private int notificationId;

    @Column(name="content")
    private String content;

    @Column(name="title")
    private String title;

    @Column(name = "date_Submit")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dateSubmit;
}
