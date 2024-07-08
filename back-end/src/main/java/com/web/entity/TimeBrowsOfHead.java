package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "time_brows_of_head")
@NoArgsConstructor
@AllArgsConstructor
public class TimeBrowsOfHead implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="time_id")
    private int timeId;

    @Column(name="time_start")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime timeStart;

    @Column(name="time_end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime timeEnd;

    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;

    @Column(name="status")
    private Boolean status;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="period_id")
    @JsonIgnore
    private RegistrationPeriodLectuer registrationPeriodLecturer;

    @OneToOne(mappedBy = "timeBrowsOfHead", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private RegistrationPeriod registrationPeriod;

}
