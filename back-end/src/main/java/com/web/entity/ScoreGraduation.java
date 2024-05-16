package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "score_graduation")
@Getter
@Setter
public class ScoreGraduation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="score_graduation_id")
    private int scoreId;

    @Column(name="score")
    private Double score;

    @Column(name="review")
    private String review;

    @ManyToOne
    @JoinColumn(name = "leturer_id")
    private Lecturer lecturer;

    @ManyToOne
    @JoinColumn(name = "result_graduation_id")
    private ResultGraduation resultGraduation;

}
