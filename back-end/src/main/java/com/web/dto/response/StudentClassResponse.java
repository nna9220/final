package com.web.dto.response;

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
public class StudentClassResponse implements Serializable {
    private int id;
    private String classname;

    private List<Student> students;
    private boolean status;
}
