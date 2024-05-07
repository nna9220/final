package com.web.repository;

import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TimeBrowsOfHead;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeBrowseHeadRepository extends JpaRepository<TimeBrowsOfHead, Integer> {
    @Query("select p from TimeBrowsOfHead p where p.typeSubjectId=:typeSubject")
    public List<TimeBrowsOfHead> findAllPeriodEssay(TypeSubject typeSubject);
}
