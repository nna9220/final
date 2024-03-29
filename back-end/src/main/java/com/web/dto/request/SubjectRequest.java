package com.web.dto.request;

import com.web.entity.Lecturer;
import com.web.entity.Student;
import com.web.entity.Task;
import com.web.entity.TypeSubject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SubjectRequest implements Serializable {
    private int subjectId;
    private String subjectName;
    private String major;
    private Double score;
    private String review;
    private String requirement;
    private String expected;
    private boolean status;

    private TypeSubject typeSubject;
    private Lecturer instructorId;
    private Lecturer thesisAdvisorId;
    private String student1;
    private String student2;
    private List<Task> tasks;
    private String year;
}
