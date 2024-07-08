package com.web.repository;

import com.web.entity.RegistrationPeriod;
import com.web.entity.TimeBrowsOfHead;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, Integer> {
    @Query("select p from RegistrationPeriod p")
    public List<RegistrationPeriod> findAllPeriod();

    @Query("select p from RegistrationPeriod p where p.typeSubjectId=:typeSubject")
    public List<RegistrationPeriod> getListPeriodBYStatusAndType(TypeSubject typeSubject);

    @Query("select p from RegistrationPeriod p where p.typeSubjectId=:typeSubject")
    public List<RegistrationPeriod> findAllByTypeSubject(TypeSubject typeSubject);

    @Query("select p from RegistrationPeriod p where p.timeBrowsOfHead=:timeBrowsOfHead")
    public RegistrationPeriod findRegistrationStudentByTimeBrowseOfHead(TimeBrowsOfHead timeBrowsOfHead);

    @Modifying
    @Transactional
    @Query("UPDATE RegistrationPeriod t SET t.status = false WHERE t.status = true AND t.registrationTimeEnd < :currentDate")
    void updateStatusOfStudent(LocalDateTime currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE RegistrationPeriod t SET t.status = true WHERE t.status = false AND t.registrationTimeEnd >= :currentDate and t.registrationTimeStart <= :currentDate")
    void turnOnStatusOfStudent(LocalDateTime currentDate);

}
