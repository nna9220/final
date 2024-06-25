package com.web.repository;

import com.web.entity.RegistrationPeriod;
import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistrationPeriodLecturerRepository extends JpaRepository<RegistrationPeriodLectuer, Integer> {
    @Query("select p from RegistrationPeriodLectuer p where p.typeSubjectId=:typeSubject")
    public List<RegistrationPeriodLectuer> findAllPeriodEssay(TypeSubject typeSubject);

    @Modifying
    @Transactional
    @Query("UPDATE RegistrationPeriodLectuer t SET t.status = false WHERE t.status = true AND t.registrationTimeEnd < :currentDate")
    void updateStatusOfLecturer(LocalDateTime currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE RegistrationPeriodLectuer t SET t.status = true WHERE t.status = false AND t.registrationTimeEnd >= :currentDate and t.registrationTimeStart <= :currentDate ")
    void turnOnStatusOfStudent(LocalDateTime currentDate);
}
