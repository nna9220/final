package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "council")
@Getter
@Setter
public class Council {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="council_id")
    private int councilId;

    @Column(name = "address")
    private String address;

    @Column(name = "date_time")
    private LocalDateTime timeReport;

    @Column(name = "date")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;

    @Column(name = "start")
    @DateTimeFormat(pattern = "HH:mm:ss")
    private LocalTime start;

    @Column(name = "end")
    @DateTimeFormat(pattern = "HH:mm:ss")
    private LocalTime end;

    @OneToOne
    @JoinColumn(name = "subject", unique = true)
    private Subject subject;

    @OneToMany(mappedBy = "council", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CouncilLecturer> councilLecturers;
}
