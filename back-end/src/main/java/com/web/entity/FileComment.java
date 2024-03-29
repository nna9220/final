package com.web.entity;

import javax.persistence.*;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@ToString
@Entity
@Table(name = "file")
@NoArgsConstructor
@AllArgsConstructor
public class FileComment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="file_id")
    private int fileId;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task taskId;

    @Column(name="url")
    private String url;

    @Column(name="name")
    private String name;


    @ManyToOne
    @JoinColumn(name="comment_id")
    private Comment commentId;
}
