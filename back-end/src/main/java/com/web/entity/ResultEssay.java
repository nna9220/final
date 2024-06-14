package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "result_essay")
@Getter
@Setter
public class ResultEssay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="result_essay_id")
    private int resultId;
    @Column(name = "score_instructor")
    private Double scoreInstructor;

    @Column(name = "score_thesis")
    private Double scoreThesis;

    @Column(name = "review_instructor")
    private String reviewInstructor;

    @Column(name = "review_thesis")
    private String reviewThesis;

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
    @JsonIgnore
    private List<EvaluationCriteria> criterias;
}
