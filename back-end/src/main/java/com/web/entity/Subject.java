package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "subject")
@NoArgsConstructor
@AllArgsConstructor
public class Subject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="subject_id")
    private int subjectId;

    @Column(name="subject_name")
    private String subjectName;

    /*TLCN
    1 là dang thực hiện
    2 GVHD đã xác nhận đề tài hoàn thành --> SV trong tgian nộp bài
    3 SV đã xác nhận nộp bài --> GVHD trong quá trình xác nhận đề tài đủ đk phản biện
    4 GVHD đã xác nhận đề tài đủ đk phản biển
    5 đã chấm điểm - đánh giá
    8 đề tài đủ đk qua môn (score+scorerThesis/2 >=5) --> Đề tài successful
    0 (score+scorerThesis/2 <5) --> Đề tài fail --> Subject hoặc subjectGraduation của SV sẽ về null
    KLTN
    1 là dang thực hiện
    2 GVHD đã xác nhận đề tài hoàn thành --> SV trong tgian nộp bài
    3 SV đã xác nhận nộp bài --> GVHD trong quá trình xác nhận đề tài đủ đk phản biện
    4 GVHD đã xác nhận đề tài đủ đk phản biển
    5 đã chấm điểm - đánh giá --> TBM trong giai đoạn lập hội đồng cho đề tài
    6 đã Lập hội đồng - Thời gian báo cáo và chấm điểm
    7 Hội đồng đã đánh giá và chấm điểm
    8 đề tài đủ đk qua môn (scoreCouncil+scorerThesis/2 >=5) --> Đề tài successful
    0 (score+scorerThesis/2 <5) --> Đề tài fail --> Subject hoặc subjectGraduation của SV sẽ về null*/
    @Column(name="active")
    private Byte active;

    @Column(name = "major", length = 50)
    @Enumerated(EnumType.STRING)
    private Major major;

    //Điểm GVHD
    @Column(name="score_instruct")
    private Double scoreInstruct;

    //Điểm GVPB
    @Column(name="score_Thesis")
    private Double scoreThesis;

    @Column(name="review")
    private String review;

    @Column(name="requirement")
    private String requirement;

    @Column(name="expected")
    private String expected;

    @ManyToOne
    @JoinColumn(name="type_id_subject")
    private TypeSubject typeSubject;

    @Column(name="status")
    private boolean status = false;

    @ManyToOne
    @JoinColumn(name="instructor_id")
    private Lecturer instructorId;

    @ManyToOne
    @JoinColumn(name="thesisAdvisor_id")
    private Lecturer thesisAdvisorId;

    @Column(name = "student_1")
    private String student1;

    @Column(name = "student_2")
    private String student2;

    @Column(name = "student_3")
    private String student3;

    @OneToMany(mappedBy = "subjectId", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;

    @Column(name="year")
    private String year;

    @Column(name="check_student")
    private Boolean checkStudent; //Check giá trị student khi gv đăng ký đề tài -> Nếu k cso sv thì false, có sv thì true

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reportFiftyPercent", referencedColumnName = "file_id")
    private FileComment fiftyPercent;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reportOneHundredPercent", referencedColumnName = "file_id")
    private FileComment oneHundredPercent;

}
