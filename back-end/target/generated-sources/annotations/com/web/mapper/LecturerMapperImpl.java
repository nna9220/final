package com.web.mapper;

import com.web.dto.request.LecturerRequest;
import com.web.dto.response.LecturerResponse;
import com.web.entity.Lecturer;
import com.web.entity.Major;
import com.web.entity.Subject;
import com.web.entity.Task;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-31T19:01:36+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class LecturerMapperImpl implements LecturerMapper {

    @Override
    public LecturerResponse toResponse(Lecturer lecturer) {
        if ( lecturer == null ) {
            return null;
        }

        LecturerResponse lecturerResponse = new LecturerResponse();

        lecturerResponse.setLecturerId( lecturer.getLecturerId() );
        lecturerResponse.setAuthority( lecturer.getAuthority() );
        if ( lecturer.getMajor() != null ) {
            lecturerResponse.setMajor( lecturer.getMajor().name() );
        }
        lecturerResponse.setPerson( lecturer.getPerson() );
        List<Subject> list = lecturer.getListSubInstruct();
        if ( list != null ) {
            lecturerResponse.setListSubInstruct( new ArrayList<Subject>( list ) );
        }
        List<Subject> list1 = lecturer.getListSubCounterArgument();
        if ( list1 != null ) {
            lecturerResponse.setListSubCounterArgument( new ArrayList<Subject>( list1 ) );
        }
        List<Task> list2 = lecturer.getTasks();
        if ( list2 != null ) {
            lecturerResponse.setTasks( new ArrayList<Task>( list2 ) );
        }

        return lecturerResponse;
    }

    @Override
    public List<LecturerResponse> toLecturerListDTO(List<Lecturer> lecturers) {
        if ( lecturers == null ) {
            return null;
        }

        List<LecturerResponse> list = new ArrayList<LecturerResponse>( lecturers.size() );
        for ( Lecturer lecturer : lecturers ) {
            list.add( toResponse( lecturer ) );
        }

        return list;
    }

    @Override
    public Lecturer toEntity(LecturerRequest lecturerRequest) {
        if ( lecturerRequest == null ) {
            return null;
        }

        Lecturer lecturer = new Lecturer();

        lecturer.setLecturerId( lecturerRequest.getLecturerId() );
        lecturer.setPerson( lecturerRequest.getPerson() );
        lecturer.setAuthority( lecturerRequest.getAuthority() );
        if ( lecturerRequest.getMajor() != null ) {
            lecturer.setMajor( Enum.valueOf( Major.class, lecturerRequest.getMajor() ) );
        }
        List<Subject> list = lecturerRequest.getListSubInstruct();
        if ( list != null ) {
            lecturer.setListSubInstruct( new ArrayList<Subject>( list ) );
        }
        List<Subject> list1 = lecturerRequest.getListSubCounterArgument();
        if ( list1 != null ) {
            lecturer.setListSubCounterArgument( new ArrayList<Subject>( list1 ) );
        }
        List<Task> list2 = lecturerRequest.getTasks();
        if ( list2 != null ) {
            lecturer.setTasks( new ArrayList<Task>( list2 ) );
        }

        return lecturer;
    }
}
