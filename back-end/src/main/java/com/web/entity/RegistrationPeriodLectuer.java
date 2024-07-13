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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime registrationTimeStart;

    @Column(name="registration_time_end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime registrationTimeEnd;

    @Column(name="registration_name")
    private String registrationName;

    @Column(name="status")
    private Boolean status;


    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;

    @OneToOne(mappedBy = "registrationPeriodLecturer", cascade = CascadeType.ALL, orphanRemoval = true)
    private TimeBrowsOfHead timeBrowsOfHead;

}
