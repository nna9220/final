package com.web.repository;

import com.web.entity.ResultEssay;
import com.web.entity.ResultGraduation;
import com.web.entity.Student;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultGraduationRepository extends JpaRepository<ResultGraduation, Integer> {
    @Query("select r from ResultGraduation r where r.student=:student and r.subject=:subject")
    public ResultGraduation findResultGraduationByStudentAndSubject(Student student, Subject subject);

    @Query("select r from ResultGraduation r where r.subject=:subject")
    public List<ResultGraduation> findResultGraduationBySubject(Subject subject);
}
