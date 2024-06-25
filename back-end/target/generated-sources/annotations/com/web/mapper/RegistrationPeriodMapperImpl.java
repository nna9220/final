package com.web.mapper;

import com.web.dto.request.RegistrationPeriodRequest;
import com.web.dto.response.RegistrationPeriodResponse;
import com.web.entity.RegistrationPeriod;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import javax.annotation.processing.Generated;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-22T04:19:05+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class RegistrationPeriodMapperImpl implements RegistrationPeriodMapper {

    private final DatatypeFactory datatypeFactory;

    public RegistrationPeriodMapperImpl() {
        try {
            datatypeFactory = DatatypeFactory.newInstance();
        }
        catch ( DatatypeConfigurationException ex ) {
            throw new RuntimeException( ex );
        }
    }

    @Override
    public RegistrationPeriodResponse toResponse(RegistrationPeriod registrationPeriod) {
        if ( registrationPeriod == null ) {
            return null;
        }

        RegistrationPeriodResponse registrationPeriodResponse = new RegistrationPeriodResponse();

        registrationPeriodResponse.setPeriodId( registrationPeriod.getPeriodId() );
        if ( registrationPeriod.getRegistrationTimeStart() != null ) {
            registrationPeriodResponse.setRegistrationTimeStart( Date.from( registrationPeriod.getRegistrationTimeStart().toInstant( ZoneOffset.UTC ) ) );
        }
        if ( registrationPeriod.getRegistrationTimeEnd() != null ) {
            registrationPeriodResponse.setRegistrationTimeEnd( Date.from( registrationPeriod.getRegistrationTimeEnd().toInstant( ZoneOffset.UTC ) ) );
        }
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
        registrationPeriod.setRegistrationTimeStart( xmlGregorianCalendarToLocalDateTime( dateToXmlGregorianCalendar( registrationPeriodRequest.getRegistrationTimeStart() ) ) );
        registrationPeriod.setRegistrationTimeEnd( xmlGregorianCalendarToLocalDateTime( dateToXmlGregorianCalendar( registrationPeriodRequest.getRegistrationTimeEnd() ) ) );
        registrationPeriod.setRegistrationName( registrationPeriodRequest.getRegistrationName() );
        registrationPeriod.setTypeSubjectId( registrationPeriodRequest.getTypeSubjectId() );

        return registrationPeriod;
    }

    private static LocalDateTime xmlGregorianCalendarToLocalDateTime( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        if ( xcal.getYear() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getMonth() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getDay() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getHour() != DatatypeConstants.FIELD_UNDEFINED
            && xcal.getMinute() != DatatypeConstants.FIELD_UNDEFINED
        ) {
            if ( xcal.getSecond() != DatatypeConstants.FIELD_UNDEFINED
                && xcal.getMillisecond() != DatatypeConstants.FIELD_UNDEFINED ) {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute(),
                    xcal.getSecond(),
                    Duration.ofMillis( xcal.getMillisecond() ).getNano()
                );
            }
            else if ( xcal.getSecond() != DatatypeConstants.FIELD_UNDEFINED ) {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute(),
                    xcal.getSecond()
                );
            }
            else {
                return LocalDateTime.of(
                    xcal.getYear(),
                    xcal.getMonth(),
                    xcal.getDay(),
                    xcal.getHour(),
                    xcal.getMinute()
                );
            }
        }
        return null;
    }

    private XMLGregorianCalendar dateToXmlGregorianCalendar( Date date ) {
        if ( date == null ) {
            return null;
        }

        GregorianCalendar c = new GregorianCalendar();
        c.setTime( date );
        return datatypeFactory.newXMLGregorianCalendar( c );
    }
}
