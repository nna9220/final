package com.web.dto.request;

import com.web.entity.Student;
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
public class StudentClassRequest implements Serializable {
    private int id;
    private String classname;
    private List<Student> students;
    private boolean status;
}
