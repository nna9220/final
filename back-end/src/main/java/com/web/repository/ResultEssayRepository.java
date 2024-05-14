package com.web.repository;

import com.web.entity.EvaluationCriteria;
import com.web.entity.ResultEssay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultEssayRepository extends JpaRepository<ResultEssay, Integer> {
}
