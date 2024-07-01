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
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "report_submission_time")
@NoArgsConstructor
@AllArgsConstructor
public class ReportSubmissionTime implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="report_time_start")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reportTimeStart;

    @Column(name="report_time_end")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reportTimeEnd;

    @Column(name="registration_name")
    private String reportName;

    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;

    @Column(name="status")
    private Boolean status;

    @OneToOne
    @JoinColumn(name="registration_period_id", nullable = false)
    @JsonBackReference
    private RegistrationPeriod registrationPeriod;

    @OneToOne(mappedBy = "reportSubmissionTime", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private CouncilReportTime councilReportTime;
}
