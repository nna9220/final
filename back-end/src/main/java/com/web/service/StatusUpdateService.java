package com.web.service;

import com.web.repository.RegistrationPeriodLecturerRepository;
import com.web.repository.RegistrationPeriodRepository;
import com.web.repository.TimeBrowseHeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
public class StatusUpdateService {
    @Autowired
    private TimeBrowseHeadRepository timeBrowsOfHeadRepository;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;

    @Transactional
    @Scheduled(fixedRate = 60000) // Chạy mỗi phút (60.000 milliseconds)
    public void updateExpiredStatuses() {
        LocalDateTime currentDate = LocalDateTime.now();
        timeBrowsOfHeadRepository.updateStatusOfPreviousRegistrations(currentDate);
        registrationPeriodRepository.updateStatusOfStudent(currentDate);
        registrationPeriodLecturerRepository.updateStatusOfLecturer(currentDate);
    }
}
