package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "lecturer")
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer implements Serializable {

    @Id
    @Column(name = "lecturer_id", columnDefinition = "VARCHAR(255)")
    private String lecturerId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "lecturer_id", referencedColumnName = "person_id")
    private Person person;

    @ManyToOne
    @JoinColumn(name="authority")
    private Authority authority;

    @Column(name="major", length = 50)
    @Enumerated(EnumType.STRING)
    private Major major;


    @OneToMany(mappedBy = "instructorId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;

    @OneToMany(mappedBy = "byLecturer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ScoreGraduation> scoreGraduationList;

    @OneToMany(mappedBy = "byLecturer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ScoreEssay> scoreEssayList;

    @OneToMany(mappedBy = "lecturer", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JsonIgnore
    private List<CouncilLecturer> councilLecturers;

    @OneToMany(mappedBy = "instructorId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReviewByInstructor> reviewByInstructors;

    @OneToMany(mappedBy = "thesisId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReviewByThesis> reviewByTheses;

}
