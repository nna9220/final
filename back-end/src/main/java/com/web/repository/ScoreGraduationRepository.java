package com.web.repository;

import com.web.entity.FileComment;
import com.web.entity.ScoreGraduation;
import com.web.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreGraduationRepository extends JpaRepository<ScoreGraduation, Integer> {/*
    @Query("select s from ScoreGraduation s where s.byLecturer=:lecturer and s.resultGraduation=:result")*/
}
