package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "review_by_instructor")
@Getter
@Setter
public class ReviewByInstructor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_id")
    private int reviewId;

    @ManyToOne
    @JoinColumn(name="instructor_id")
    private Lecturer instructorId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subject", referencedColumnName = "subject_id")
    private Subject subject;

    //Nhận xét ề nội dung
    @Column(name="reviewContent")
    private String reviewContent;

    //Về ưu điểm
    @Column(name="reviewAdvantage")
    private String reviewAdvantage;

    //Về khuyết điểm
    @Column(name="reviewWeakness")
    private String reviewWeakness;

    //Cho bảo vệ hay k
    @Column(name="status")
    private Boolean status;

    //Đánh giá loại
    @Column(name = "classification")
    private String classification;

    //Điểm cho toàn đề tài = mỗi sv đều = điểm
    @Column(name = "score")
    private double score; // giá trị từ 0 - 10

}
