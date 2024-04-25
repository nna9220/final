package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "council")
@Getter
@Setter
public class Council {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="council_id")
    private int councilId;

    // 3-5 GV
}
