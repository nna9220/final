package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "council_lecturer", uniqueConstraints = @UniqueConstraint(columnNames = {"council_id", "lecturer_id"}))
@Getter
@Setter
public class CouncilLecturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "council_id")
    private Council council;

    @ManyToOne
    @JoinColumn(name = "lecturer_id")
    private Lecturer lecturer;

    @Column(name = "role") //Chủ tịch, ủy viên
    private String role;
}
