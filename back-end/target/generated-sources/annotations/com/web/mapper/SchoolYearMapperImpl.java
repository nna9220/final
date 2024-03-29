package com.web.mapper;

import com.web.dto.request.SchoolYearRequest;
import com.web.dto.response.SchoolYearResponse;
import com.web.entity.SchoolYear;
import com.web.entity.Student;
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
public class SchoolYearMapperImpl implements SchoolYearMapper {

    @Override
    public SchoolYearResponse toResponse(SchoolYear schoolYear) {
        if ( schoolYear == null ) {
            return null;
        }

        SchoolYearResponse schoolYearResponse = new SchoolYearResponse();

        schoolYearResponse.setYearId( schoolYear.getYearId() );
        schoolYearResponse.setYear( schoolYear.getYear() );
        List<Student> list = schoolYear.getStudents();
        if ( list != null ) {
            schoolYearResponse.setStudents( new ArrayList<Student>( list ) );
        }

        return schoolYearResponse;
    }

    @Override
    public List<SchoolYearResponse> toSchoolYearListDTO(List<SchoolYear> schoolYears) {
        if ( schoolYears == null ) {
            return null;
        }

        List<SchoolYearResponse> list = new ArrayList<SchoolYearResponse>( schoolYears.size() );
        for ( SchoolYear schoolYear : schoolYears ) {
            list.add( toResponse( schoolYear ) );
        }

        return list;
    }

    @Override
    public SchoolYear toEntity(SchoolYearRequest schoolYearRequest) {
        if ( schoolYearRequest == null ) {
            return null;
        }

        SchoolYear schoolYear = new SchoolYear();

        List<Student> list = schoolYearRequest.getStudents();
        if ( list != null ) {
            schoolYear.setStudents( new ArrayList<Student>( list ) );
        }
        schoolYear.setYear( schoolYearRequest.getYear() );
        schoolYear.setYearId( schoolYearRequest.getYearId() );

        return schoolYear;
    }
}