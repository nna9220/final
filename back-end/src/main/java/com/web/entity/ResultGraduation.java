package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "result_graduation")
@Getter
@Setter
public class ResultGraduation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="result_graduation_id")
    private int resultId;

    @Column(name = "score_Instructor")
    private Double scoreInstructor;

    @OneToMany(mappedBy = "resultGraduation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ScoreGraduation> scoreCouncil;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToOne
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    @ManyToMany
    @JoinTable(
            name = "result_criteria",
            joinColumns = @JoinColumn(name = "result_id"),
            inverseJoinColumns = @JoinColumn(name = "criteria_id")
    )
    private List<EvaluationCriteria> criterias;
}
