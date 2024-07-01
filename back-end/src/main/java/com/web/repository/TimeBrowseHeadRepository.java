package com.web.repository;

import com.web.entity.RegistrationPeriodLectuer;
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
public interface TimeBrowseHeadRepository extends JpaRepository<TimeBrowsOfHead, Integer> {
    @Query("select p from TimeBrowsOfHead p where p.typeSubjectId=:typeSubject")
    public List<TimeBrowsOfHead> findAllPeriodEssay(TypeSubject typeSubject);

    @Query("select t from TimeBrowsOfHead t where t.registrationPeriodLectuer=:registrationPeriodLectuer")
    public TimeBrowsOfHead findTimeBrowseOfHeadByRegistrationLecturer(RegistrationPeriodLectuer registrationPeriodLectuer);

    @Query("select p from TimeBrowsOfHead p where p.status =true and p.typeSubjectId = :type")
    public List<TimeBrowsOfHead> getListTimeBrowseByStatus(TypeSubject type);

    @Modifying
    @Transactional
    @Query("UPDATE TimeBrowsOfHead t SET t.status = false WHERE t.status = true AND t.timeEnd < :currentDate")
    void updateStatusOfPreviousRegistrations(LocalDateTime currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE TimeBrowsOfHead t SET t.status = true WHERE t.status = false AND t.timeStart <= :currentDate AND t.timeEnd >= :currentDate")
    void turnOnStatusOfPreviousRegistrations(LocalDateTime currentDate);
}
