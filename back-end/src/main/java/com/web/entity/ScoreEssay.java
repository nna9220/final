package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "score_essay")
@Getter
@Setter
public class ScoreEssay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="score_essay_id")
    private int scoreId;

    @Column(name="score")
    private Double score;

    @Column(name="review")
    private String review;

    @ManyToOne
    @JoinColumn(name = "leturer_id")
    private Lecturer byLecturer;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "result_essay_id")
    private ResultEssay resultEssay;

}
