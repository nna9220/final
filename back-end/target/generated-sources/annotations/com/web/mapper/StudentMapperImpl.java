package com.web.mapper;

import com.web.dto.request.StudentRequest;
import com.web.dto.response.StudentResponse;
import com.web.entity.Major;
import com.web.entity.Student;
import com.web.entity.Task;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-29T12:17:53+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.37.0.v20240206-1609, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class StudentMapperImpl implements StudentMapper {

    @Override
    public StudentResponse toResponse(Student student) {
        if ( student == null ) {
            return null;
        }

        StudentResponse studentResponse = new StudentResponse();

        if ( student.getMajor() != null ) {
            studentResponse.setMajor( student.getMajor().name() );
        }
        studentResponse.setPerson( student.getPerson() );
        studentResponse.setSchoolYear( student.getSchoolYear() );
        studentResponse.setStudentClass( student.getStudentClass() );
        studentResponse.setStudentId( student.getStudentId() );
        studentResponse.setSubjectId( student.getSubjectId() );
        List<Task> list = student.getTasks();
        if ( list != null ) {
            studentResponse.setTasks( new ArrayList<Task>( list ) );
        }

        return studentResponse;
    }

    @Override
    public List<StudentResponse> toStudentListDTO(List<Student> students) {
        if ( students == null ) {
            return null;
        }

        List<StudentResponse> list = new ArrayList<StudentResponse>( students.size() );
        for ( Student student : students ) {
            list.add( toResponse( student ) );
        }

        return list;
    }

    @Override
    public Student toEntity(StudentRequest studentRequest) {
        if ( studentRequest == null ) {
            return null;
        }

        Student student = new Student();

        if ( studentRequest.getMajor() != null ) {
            student.setMajor( Enum.valueOf( Major.class, studentRequest.getMajor() ) );
        }
        student.setSchoolYear( studentRequest.getSchoolYear() );
        student.setStudentClass( studentRequest.getStudentClass() );
        student.setStudentId( studentRequest.getStudentId() );
        student.setSubjectId( studentRequest.getSubjectId() );
        List<Task> list = studentRequest.getTasks();
        if ( list != null ) {
            student.setTasks( new ArrayList<Task>( list ) );
        }

        return student;
    }
}
