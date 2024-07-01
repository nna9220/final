package com.web.repository;

import com.web.entity.RegistrationPeriod;
import com.web.entity.ReportSubmissionTime;
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
public interface ReportSubmissionTimeRepository extends JpaRepository<ReportSubmissionTime, Integer> {

    @Query("select p from ReportSubmissionTime p where p.registrationPeriod=:registrationPeriod")
    public ReportSubmissionTime findReportSubmissionTimeByRegistrationStudent(RegistrationPeriod registrationPeriod);

    // Tìm kiếm ReportSubmissionTime theo TypeSubject và Status
    @Query("select p from ReportSubmissionTime p where p.typeSubjectId=:typeSubject and p.status=:status")
    List<ReportSubmissionTime> findReportTimeTypeSubjectAndStatus(TypeSubject typeSubject, boolean status);

    @Modifying
    @Transactional
    @Query("UPDATE ReportSubmissionTime t SET t.status = false WHERE t.status = true AND t.reportTimeEnd < :currentDate")
    void updateStatusOfReportTime(LocalDateTime currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE ReportSubmissionTime t SET t.status = true WHERE t.status = false AND t.reportTimeEnd >= :currentDate and t.reportTimeStart <= :currentDate")
    void turnOnStatusOfReportTime(LocalDateTime currentDate);

}
