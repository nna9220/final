package com.web.repository;

import com.web.entity.RegistrationPeriod;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, Integer> {
    @Query("select p from RegistrationPeriod p")
    public List<RegistrationPeriod> findAllPeriod();
    @Query("select p from RegistrationPeriod p where p.typeSubjectId=:typeSubject")
    public List<RegistrationPeriod> findAllByTypeSubject(TypeSubject typeSubject);

}
