package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

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
    private LocalDateTime registrationTimeStart;

    @Column(name="registration_time_end")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationTimeEnd;

    @Column(name="registration_name")
    private String registrationName;

    @Column(name="status")
    private Boolean status;

    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="time_id", nullable = false)
    @JsonBackReference
    private TimeBrowsOfHead timeBrowsOfHead;

    @OneToOne(mappedBy = "registrationPeriod",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private ReportSubmissionTime reportSubmissionTime;
}
