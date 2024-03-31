package com.web.mapper;

import com.web.dto.request.TypeSubjectRequest;
import com.web.dto.response.TypeSubjectResponse;
import com.web.entity.RegistrationPeriod;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-31T04:39:08+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class TypeSubjectMapperImpl implements TypeSubjectMapper {

    @Override
    public TypeSubjectResponse toResponse(TypeSubject typeSubject) {
        if ( typeSubject == null ) {
            return null;
        }

        TypeSubjectResponse typeSubjectResponse = new TypeSubjectResponse();

        typeSubjectResponse.setTypeId( typeSubject.getTypeId() );
        typeSubjectResponse.setTypeName( typeSubject.getTypeName() );
        List<Subject> list = typeSubject.getSubjectsList();
        if ( list != null ) {
            typeSubjectResponse.setSubjectsList( new ArrayList<Subject>( list ) );
        }
        List<RegistrationPeriod> list1 = typeSubject.getRegistrationPeriods();
        if ( list1 != null ) {
            typeSubjectResponse.setRegistrationPeriods( new ArrayList<RegistrationPeriod>( list1 ) );
        }

        return typeSubjectResponse;
    }

    @Override
    public List<TypeSubjectResponse> toTypeSubjectListDTO(List<TypeSubject> typeSubjects) {
        if ( typeSubjects == null ) {
            return null;
        }

        List<TypeSubjectResponse> list = new ArrayList<TypeSubjectResponse>( typeSubjects.size() );
        for ( TypeSubject typeSubject : typeSubjects ) {
            list.add( toResponse( typeSubject ) );
        }

        return list;
    }

    @Override
    public TypeSubject toEntity(TypeSubjectRequest typeSubjectRequest) {
        if ( typeSubjectRequest == null ) {
            return null;
        }

        TypeSubject typeSubject = new TypeSubject();

        typeSubject.setTypeId( typeSubjectRequest.getTypeId() );
        typeSubject.setTypeName( typeSubjectRequest.getTypeName() );
        List<Subject> list = typeSubjectRequest.getSubjectsList();
        if ( list != null ) {
            typeSubject.setSubjectsList( new ArrayList<Subject>( list ) );
        }
        List<RegistrationPeriod> list1 = typeSubjectRequest.getRegistrationPeriods();
        if ( list1 != null ) {
            typeSubject.setRegistrationPeriods( new ArrayList<RegistrationPeriod>( list1 ) );
        }

        return typeSubject;
    }
}
