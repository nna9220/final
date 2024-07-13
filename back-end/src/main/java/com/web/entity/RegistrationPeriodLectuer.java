package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "register_period_lecturer")
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationPeriodLectuer implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="period_id")
    private int periodId;

    @Column(name="registration_time_start")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationTimeStart;

    @Column(name="registration_time_end")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationTimeEnd;

    @Column(name="registration_name")
    private String registrationName;

    @Column(name="status")
    private Boolean status;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="type_subject_id")
    @JsonManagedReference
    private TypeSubject typeSubjectId;

    @OneToOne(mappedBy = "registrationPeriodLecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private TimeBrowsOfHead timeBrowsOfHead;

}
