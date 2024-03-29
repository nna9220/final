package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import javax.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.sql.Date;

@Setter
@Getter
@Entity
@Table(name = "register_period")
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationPeriod implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="period_id")
    private int periodId;

    @Column(name="registration_time_start")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date registrationTimeStart;

    @Column(name="registration_time_end")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date registrationTimeEnd;

    @Column(name="registration_name")
    private String registrationName;

    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;
}
