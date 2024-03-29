package com.web.dto.request;

import com.web.entity.*;
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
public class StudentRequest implements Serializable {
    private String studentId;
    private String major;
    private StudentClass studentClass;
    private SchoolYear schoolYear;
    private Subject subjectId;
    private Person personId;
    private List<Task> tasks;
}

