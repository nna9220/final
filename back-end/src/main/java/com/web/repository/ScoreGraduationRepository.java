package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreGraduationRepository extends JpaRepository<ScoreGraduation, Integer> {
    @Query("select s from ScoreGraduation s where s.byLecturer=:lecturer and s.resultGraduation=:result")
    ScoreGraduation getScoreGraduationByLecturerAndReAndResultGraduation(Lecturer lecturer, ResultGraduation result);
    @Query("select s from ScoreGraduation s where s.resultGraduation=:result")
    List<ScoreGraduation> getScoreGraduationByResultGraduation(ResultGraduation resultGraduation);
}
