package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "evaluation_criteria")
@Getter
@Setter
public class EvaluationCriteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="criteria_id")
    private int criteriaId;

    @Column(name = "criteria_name")
    private String criteriaName;

    @Column(name = "criteria_score")
    private Double criteriaScore;

    @ManyToOne
    @JoinColumn(name="type_id_subject")
    private TypeSubject typeSubject;

    @Column(name="major", length = 50)
    @Enumerated(EnumType.STRING)
    private Major major;

    @ManyToMany(mappedBy = "criterias")
    private List<ResultEssay> resultEssays;

    @ManyToMany(mappedBy = "criterias")
    private List<ResultGraduation> resultGraduations;
}
