package com.web.entity;

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

    @Column(name = "score_1")
    private Double score1;

    @Column(name = "score_2")
    private Double score2;

    @Column(name = "score_3")
    private Double score3;

    @Column(name = "score_4")
    private Double score4;

    @Column(name = "score_5")
    private Double score5;

    @Column(name = "review_1")
    private String review1;

    @Column(name = "review_2")
    private String review2;

    @Column(name = "review_3")
    private String review3;

    @Column(name = "review_4")
    private String review4;

    @Column(name = "review_5")
    private String review5;

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
