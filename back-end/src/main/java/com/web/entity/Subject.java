package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "subject")
@AllArgsConstructor
public class Subject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="subject_id")
    private int subjectId;

    @OneToOne
    @JoinColumn(name = "council", unique = true)
    private Council council;

    @Column(name="subject_name")
    private String subjectName;

    @Column(name="active")
    private Byte active;

    @Column(name = "major", length = 50)
    @Enumerated(EnumType.STRING)
    private Major major;

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
    public Subject() {
        this.checkStudent = false;
    }

    @ManyToMany(mappedBy = "lecturers")
    private List<Council> councils;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<ResultEssay> resultEssays;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<ResultGraduation> resultGraduations;
}
