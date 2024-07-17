package com.web.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.*;
import lombok.*;
import org.w3c.dom.stylesheets.LinkStyle;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "student")
@NoArgsConstructor
@AllArgsConstructor
public class Student implements Serializable {
    @Id
    @Column(name = "student_id", columnDefinition = "VARCHAR(255)")
    private String studentId;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Person person;

    @Column(name = "major", length = 50)
    @Enumerated(EnumType.STRING)
    private Major major;

    @Column(name="status")
    private Boolean status;

    @ManyToOne
    @JoinColumn(name="class_id")
    private StudentClass studentClass;

    @ManyToOne
    @JoinColumn(name="year_id")
    private SchoolYear schoolYear;

    //Tiểu luận
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="subject_id")
    @JsonIgnore
    private Subject subjectId;

    //Khóa luận
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="subjectGraduation_id")
    @JsonIgnore
    private Subject subjectGraduationId;

    @OneToMany(mappedBy = "assignTo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private ResultEssay resultEssay;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private ResultGraduation resultGraduation;
}
