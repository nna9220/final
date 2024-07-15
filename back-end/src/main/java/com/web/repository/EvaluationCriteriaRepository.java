package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface EvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Integer> {

    @Query("SELECT e FROM EvaluationCriteria e where e.typeSubject=:typeSubject and e.major=:major")
    public List<EvaluationCriteria> getEvaluationCriteriaByTypeSubjectAndCriteriaId(TypeSubject typeSubject, Major major);

    @Query("SELECT e FROM EvaluationCriteria e where e.typeSubject=:typeSubject and e.major=:major and e.year=:year")
    public List<EvaluationCriteria> getEvaluationCriteriaByTypeSubjectAndMajorAndYear(TypeSubject typeSubject, Major major, String year);

    @Query("SELECT e FROM EvaluationCriteria e where e.typeSubject=:typeSubject")
    public Set<EvaluationCriteria> getEvaluationCriteriaByTypeSubject(TypeSubject typeSubject);


}
