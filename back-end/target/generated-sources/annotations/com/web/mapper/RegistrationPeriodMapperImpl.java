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
    date = "2024-04-11T22:21:14+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
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
        registrationPeriodResponse.setRegistrationTimeStart( registrationPeriod.getRegistrationTimeStart() );
        registrationPeriodResponse.setRegistrationTimeEnd( registrationPeriod.getRegistrationTimeEnd() );
        registrationPeriodResponse.setRegistrationName( registrationPeriod.getRegistrationName() );
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
        registrationPeriod.setRegistrationTimeStart( registrationPeriodRequest.getRegistrationTimeStart() );
        registrationPeriod.setRegistrationTimeEnd( registrationPeriodRequest.getRegistrationTimeEnd() );
        registrationPeriod.setRegistrationName( registrationPeriodRequest.getRegistrationName() );
        registrationPeriod.setTypeSubjectId( registrationPeriodRequest.getTypeSubjectId() );

        return registrationPeriod;
    }
}
