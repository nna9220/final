package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;
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

    @OneToOne
    @JoinColumn(name = "subject", unique = true)
    @JsonIgnore
    private Subject subject;

    @ManyToMany(mappedBy = "councils")
    @JsonIgnore
    private List<Lecturer> lecturers;
}
