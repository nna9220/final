package com.web.mapper;

import com.web.entity.Student;
import com.web.dto.request.StudentRequest;
import com.web.dto.response.StudentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {

    StudentResponse toResponse(Student student);

    List<StudentResponse> toStudentListDTO(List<Student> students);

    Student toEntity(StudentRequest studentRequest);
}
