package com.web.repository;

import com.web.entity.TimeAddSubjectOfHead;
import com.web.entity.TimeBrowsOfHead;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeAddSubjectHeadRepository extends JpaRepository<TimeAddSubjectOfHead, Integer> {
    @Query("select p from TimeAddSubjectOfHead p where p.typeSubjectId=:typeSubject")
    public List<TimeAddSubjectOfHead> findAllPeriodEssay(TypeSubject typeSubject);
}
