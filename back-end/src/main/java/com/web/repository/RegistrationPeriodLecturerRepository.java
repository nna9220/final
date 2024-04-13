package com.web.repository;

import com.web.entity.RegistrationPeriod;
import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationPeriodLecturerRepository extends JpaRepository<RegistrationPeriodLectuer, Integer> {
    @Query("select p from RegistrationPeriodLectuer p where p.typeSubjectId=:typeSubject")
    public List<RegistrationPeriodLectuer> findAllPeriodEssay(TypeSubject typeSubject);

}
