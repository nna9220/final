package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @JsonIgnore
    private List<ResultEssay> resultEssays;

    @ManyToMany(mappedBy = "criterias")
    @JsonIgnore
    private List<ResultGraduation> resultGraduations;

    @ManyToMany(mappedBy = "criteria", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonBackReference
    private Set<Subject> subjects = new HashSet<>();
}
