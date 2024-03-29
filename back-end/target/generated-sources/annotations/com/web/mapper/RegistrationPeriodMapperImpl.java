package com.web.mapper;

import com.web.dto.request.RegistrationPeriodRequest;
import com.web.dto.response.RegistrationPeriodResponse;
import com.web.entity.RegistrationPeriod;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-29T12:17:52+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.37.0.v20240206-1609, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class RegistrationPeriodMapperImpl implements RegistrationPeriodMapper {

    @Override
    public RegistrationPeriodResponse toResponse(RegistrationPeriod registrationPeriod) {
        if ( registrationPeriod == null ) {
            return null;
        }

        RegistrationPeriodResponse registrationPeriodResponse = new RegistrationPeriodResponse();

        registrationPeriodResponse.setPeriodId( registrationPeriod.getPeriodId() );
        registrationPeriodResponse.setRegistrationName( registrationPeriod.getRegistrationName() );
        registrationPeriodResponse.setRegistrationTimeEnd( registrationPeriod.getRegistrationTimeEnd() );
        registrationPeriodResponse.setRegistrationTimeStart( registrationPeriod.getRegistrationTimeStart() );
        registrationPeriodResponse.setTypeSubjectId( registrationPeriod.getTypeSubjectId() );

        return registrationPeriodResponse;
    }

    @Override
    public List<RegistrationPeriodResponse> toRegistrationPeriodListDTO(List<RegistrationPeriod> registrationPeriods) {
        if ( registrationPeriods == null ) {
            return null;
        }

        List<RegistrationPeriodResponse> list = new ArrayList<RegistrationPeriodResponse>( registrationPeriods.size() );
        for ( RegistrationPeriod registrationPeriod : registrationPeriods ) {
            list.add( toResponse( registrationPeriod ) );
        }

        return list;
    }

    @Override
    public RegistrationPeriod toEntity(RegistrationPeriodRequest registrationPeriodRequest) {
        if ( registrationPeriodRequest == null ) {
            return null;
        }

        RegistrationPeriod registrationPeriod = new RegistrationPeriod();

        registrationPeriod.setPeriodId( registrationPeriodRequest.getPeriodId() );
        registrationPeriod.setRegistrationName( registrationPeriodRequest.getRegistrationName() );
        registrationPeriod.setRegistrationTimeEnd( registrationPeriodRequest.getRegistrationTimeEnd() );
        registrationPeriod.setRegistrationTimeStart( registrationPeriodRequest.getRegistrationTimeStart() );
        registrationPeriod.setTypeSubjectId( registrationPeriodRequest.getTypeSubjectId() );

        return registrationPeriod;
    }
}
