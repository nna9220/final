package com.web.mapper;

import com.web.dto.request.SubjectRequest;
import com.web.dto.response.SubjectResponse;
import com.web.entity.Major;
import com.web.entity.Subject;
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
public class SubjectMapperImpl implements SubjectMapper {

    @Override
    public SubjectResponse toResponse(Subject subject) {
        if ( subject == null ) {
            return null;
        }

        SubjectResponse subjectResponse = new SubjectResponse();

        subjectResponse.setSubjectId( subject.getSubjectId() );
        subjectResponse.setSubjectName( subject.getSubjectName() );
        if ( subject.getMajor() != null ) {
            subjectResponse.setMajor( subject.getMajor().name() );
        }
        subjectResponse.setReview( subject.getReview() );
        subjectResponse.setRequirement( subject.getRequirement() );
        subjectResponse.setExpected( subject.getExpected() );
        subjectResponse.setStatus( subject.isStatus() );
        subjectResponse.setTypeSubject( subject.getTypeSubject() );
        subjectResponse.setInstructorId( subject.getInstructorId() );
        subjectResponse.setThesisAdvisorId( subject.getThesisAdvisorId() );
        subjectResponse.setStudent1( subject.getStudent1() );
        subjectResponse.setStudent2( subject.getStudent2() );
        List<Task> list = subject.getTasks();
        if ( list != null ) {
            subjectResponse.setTasks( new ArrayList<Task>( list ) );
        }
        subjectResponse.setYear( subject.getYear() );

        return subjectResponse;
    }

    @Override
    public List<SubjectResponse> toSubjectListDTO(List<Subject> subjects) {
        if ( subjects == null ) {
            return null;
        }

        List<SubjectResponse> list = new ArrayList<SubjectResponse>( subjects.size() );
        for ( Subject subject : subjects ) {
            list.add( toResponse( subject ) );
        }

        return list;
    }

    @Override
    public Subject toEntity(SubjectRequest subjectRequest) {
        if ( subjectRequest == null ) {
            return null;
        }

        Subject subject = new Subject();

        subject.setSubjectId( subjectRequest.getSubjectId() );
        subject.setSubjectName( subjectRequest.getSubjectName() );
        if ( subjectRequest.getMajor() != null ) {
            subject.setMajor( Enum.valueOf( Major.class, subjectRequest.getMajor() ) );
        }
        subject.setInstructorId( subjectRequest.getInstructorId() );
        subject.setThesisAdvisorId( subjectRequest.getThesisAdvisorId() );
        subject.setReview( subjectRequest.getReview() );
        subject.setRequirement( subjectRequest.getRequirement() );
        subject.setExpected( subjectRequest.getExpected() );
        subject.setTypeSubject( subjectRequest.getTypeSubject() );
        subject.setStatus( subjectRequest.isStatus() );
        subject.setStudent1( subjectRequest.getStudent1() );
        subject.setStudent2( subjectRequest.getStudent2() );
        List<Task> list = subjectRequest.getTasks();
        if ( list != null ) {
            subject.setTasks( new ArrayList<Task>( list ) );
        }
        subject.setYear( subjectRequest.getYear() );

        return subject;
    }
}
