package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Integer> {

    @Query("SELECT * FROM EvaluationCriteria e where e.typeSubject=:typeSubject and e.major=:major")
    public List<EvaluationCriteria> getEvaluationCriteriaByTypeSubjectAndCriteriaId(TypeSubject typeSubject, Major major);
}
