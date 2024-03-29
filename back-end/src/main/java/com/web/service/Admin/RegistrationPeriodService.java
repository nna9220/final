package com.web.service.Admin;

import com.web.entity.RegistrationPeriod;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.dto.request.RegistrationPeriodRequest;
import com.web.repository.RegistrationPeriodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationPeriodService {
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private RegistrationPeriodMapper registrationPeriodMapper;

    public List<RegistrationPeriod> findAll(){
        return registrationPeriodRepository.findAllPeriod();
    }

    public RegistrationPeriod createPeriod(RegistrationPeriodRequest registrationPeriodRequest){
        var period = registrationPeriodMapper.toEntity(registrationPeriodRequest);
        return registrationPeriodRepository.save(period);
    }
    public RegistrationPeriod editPeriod(RegistrationPeriod registrationPeriodRequest){
        return registrationPeriodRepository.save(registrationPeriodRequest);
    }

}
