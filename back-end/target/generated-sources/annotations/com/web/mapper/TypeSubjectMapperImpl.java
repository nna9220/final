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
    date = "2024-03-29T12:17:54+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.37.0.v20240206-1609, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class TypeSubjectMapperImpl implements TypeSubjectMapper {

    @Override
    public TypeSubjectResponse toResponse(TypeSubject typeSubject) {
        if ( typeSubject == null ) {
            return null;
        }

        TypeSubjectResponse typeSubjectResponse = new TypeSubjectResponse();

        List<RegistrationPeriod> list = typeSubject.getRegistrationPeriods();
        if ( list != null ) {
            typeSubjectResponse.setRegistrationPeriods( new ArrayList<RegistrationPeriod>( list ) );
        }
        List<Subject> list1 = typeSubject.getSubjectsList();
        if ( list1 != null ) {
            typeSubjectResponse.setSubjectsList( new ArrayList<Subject>( list1 ) );
        }
        typeSubjectResponse.setTypeId( typeSubject.getTypeId() );
        typeSubjectResponse.setTypeName( typeSubject.getTypeName() );

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

        List<RegistrationPeriod> list = typeSubjectRequest.getRegistrationPeriods();
        if ( list != null ) {
            typeSubject.setRegistrationPeriods( new ArrayList<RegistrationPeriod>( list ) );
        }
        List<Subject> list1 = typeSubjectRequest.getSubjectsList();
        if ( list1 != null ) {
            typeSubject.setSubjectsList( new ArrayList<Subject>( list1 ) );
        }
        typeSubject.setTypeId( typeSubjectRequest.getTypeId() );
        typeSubject.setTypeName( typeSubjectRequest.getTypeName() );

        return typeSubject;
    }
}
