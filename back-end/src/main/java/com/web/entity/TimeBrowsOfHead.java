package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

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
    private Date timeStart;

    @Column(name="time_end")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private Date timeEnd;

    @ManyToOne
    @JoinColumn(name="type_subject_id")
    private TypeSubject typeSubjectId;

}
