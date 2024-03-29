package com.web.mapper;

import com.web.entity.RegistrationPeriod;
import com.web.dto.request.RegistrationPeriodRequest;
import com.web.dto.response.RegistrationPeriodResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RegistrationPeriodMapper {

    RegistrationPeriodResponse toResponse(RegistrationPeriod registrationPeriod);

    List<RegistrationPeriodResponse> toRegistrationPeriodListDTO(List<RegistrationPeriod> registrationPeriods);

    RegistrationPeriod toEntity(RegistrationPeriodRequest registrationPeriodRequest);
}
