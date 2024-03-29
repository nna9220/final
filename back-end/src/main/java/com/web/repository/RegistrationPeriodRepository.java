package com.web.repository;

import com.web.entity.RegistrationPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, Integer> {
    @Query("select p from RegistrationPeriod p")
    public List<RegistrationPeriod> findAllPeriod();

}
