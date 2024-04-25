package com.web.mapper;

import com.web.dto.request.StudentClassRequest;
import com.web.dto.response.StudentClassResponse;
import com.web.entity.Student;
import com.web.entity.StudentClass;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-25T13:27:55+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 18.0.2 (Oracle Corporation)"
)
@Component
public class StudentClassMapperImpl implements StudentClassMapper {

    @Override
    public StudentClassResponse toResponse(StudentClass studentClass) {
        if ( studentClass == null ) {
            return null;
        }

        StudentClassResponse studentClassResponse = new StudentClassResponse();

        studentClassResponse.setId( studentClass.getId() );
        studentClassResponse.setClassname( studentClass.getClassname() );
        studentClassResponse.setStatus( studentClass.isStatus() );
        List<Student> list = studentClass.getStudents();
        if ( list != null ) {
            studentClassResponse.setStudents( new ArrayList<Student>( list ) );
        }

        return studentClassResponse;
    }

    @Override
    public List<StudentClassResponse> toStudentClassListDTO(List<StudentClass> studentClasses) {
        if ( studentClasses == null ) {
            return null;
        }

        List<StudentClassResponse> list = new ArrayList<StudentClassResponse>( studentClasses.size() );
        for ( StudentClass studentClass : studentClasses ) {
            list.add( toResponse( studentClass ) );
        }

        return list;
    }

    @Override
    public StudentClass toEntity(StudentClassRequest studentClassRequest) {
        if ( studentClassRequest == null ) {
            return null;
        }

        StudentClass studentClass = new StudentClass();

        studentClass.setId( studentClassRequest.getId() );
        studentClass.setClassname( studentClassRequest.getClassname() );
        studentClass.setStatus( studentClassRequest.isStatus() );
        List<Student> list = studentClassRequest.getStudents();
        if ( list != null ) {
            studentClass.setStudents( new ArrayList<Student>( list ) );
        }

        return studentClass;
    }
}
