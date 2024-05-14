package com.web.repository;

import com.web.entity.ResultGraduation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultGraduationRepository extends JpaRepository<ResultGraduation, Integer> {
}
