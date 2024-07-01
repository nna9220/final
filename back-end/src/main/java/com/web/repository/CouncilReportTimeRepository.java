package com.web.repository;

import com.web.entity.CouncilReportTime;
import com.web.entity.RegistrationPeriod;
import com.web.entity.ReportSubmissionTime;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CouncilReportTimeRepository extends JpaRepository<CouncilReportTime, Integer> {

    @Query("select p from CouncilReportTime p where p.reportSubmissionTime=:reportSubmissionTime")
    public CouncilReportTime findCouncilReportTimeByReportSubmissionTime(ReportSubmissionTime reportSubmissionTime);

    @Query("select p from CouncilReportTime p where p.typeSubjectId=:typeSubject and p.status=:status")
    List<CouncilReportTime> findCouncilReportTimeByTypeSubjectAndStatus(TypeSubject typeSubject, boolean status);

    @Modifying
    @Transactional
    @Query("UPDATE CouncilReportTime t SET t.status = false WHERE t.status = true AND t.reportTimeEnd < :currentDate")
    void updateStatusOfCouncilReportTime(LocalDateTime currentDate);

    @Modifying
    @Transactional
    @Query("UPDATE CouncilReportTime t SET t.status = true WHERE t.status = false AND t.reportTimeEnd >= :currentDate and t.reportTimeStart <= :currentDate")
    void turnOnStatusOfCouncilReportTime(LocalDateTime currentDate);
}
