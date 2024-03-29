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
public class SchoolYearRequest implements Serializable {
    private int yearId;
    private String year;

    private List<Student> students;
}
