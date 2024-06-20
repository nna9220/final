package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreEssayRepository extends JpaRepository<ScoreEssay, Integer> {
    @Query("select s from ScoreEssay s where s.byLecturer=:lecturer and s.resultEssay=:result")
    ScoreEssay getScoreEssayByLecturerAndReAndResultEssay(Lecturer lecturer, ResultEssay result);
    @Query("select s from ScoreEssay s where s.resultEssay=:result")
    List<ScoreEssay> getScoreEssayByResultEssay(ResultEssay result);

}
