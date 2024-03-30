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
    date = "2024-03-29T18:01:25+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class StudentMapperImpl implements StudentMapper {

    @Override
    public StudentResponse toResponse(Student student) {
        if ( student == null ) {
            return null;
        }

        StudentResponse studentResponse = new StudentResponse();

        studentResponse.setStudentId( student.getStudentId() );
        if ( student.getMajor() != null ) {
            studentResponse.setMajor( student.getMajor().name() );
        }
        studentResponse.setStudentClass( student.getStudentClass() );
        studentResponse.setSchoolYear( student.getSchoolYear() );
        studentResponse.setSubjectId( student.getSubjectId() );
        List<Task> list = student.getTasks();
        if ( list != null ) {
            studentResponse.setTasks( new ArrayList<Task>( list ) );
        }
        studentResponse.setPerson( student.getPerson() );

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

        student.setStudentId( studentRequest.getStudentId() );
        if ( studentRequest.getMajor() != null ) {
            student.setMajor( Enum.valueOf( Major.class, studentRequest.getMajor() ) );
        }
        student.setStudentClass( studentRequest.getStudentClass() );
        student.setSchoolYear( studentRequest.getSchoolYear() );
        student.setSubjectId( studentRequest.getSubjectId() );
        List<Task> list = studentRequest.getTasks();
        if ( list != null ) {
            student.setTasks( new ArrayList<Task>( list ) );
        }

        return student;
    }
}
