package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

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
    private Date registrationTimeStart;

    @Column(name="registration_time_end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private Date registrationTimeEnd;

    @Column(name="registration_name")
    private String registrationName;

}
