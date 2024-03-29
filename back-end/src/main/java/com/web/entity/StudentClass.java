package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "student_class")
@NoArgsConstructor
@AllArgsConstructor
public class StudentClass implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="classname", length = 50)
    private String classname;

    @Column(name="status", length = 50)
    private boolean status=true;

    @OneToMany(mappedBy = "studentClass", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Student> students = new ArrayList<>();
}
