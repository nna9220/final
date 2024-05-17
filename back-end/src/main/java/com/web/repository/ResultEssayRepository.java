package com.web.repository;

import com.web.entity.EvaluationCriteria;
import com.web.entity.ResultEssay;
import com.web.entity.Student;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultEssayRepository extends JpaRepository<ResultEssay, Integer> {
    //Tìm kiếm kết quả theo đề tài và sinh viên
    @Query("select r from ResultEssay r where r.student=:student and r.subject=:subject")
    public ResultEssay findResultEssayByStudentAndSubject(Student student, Subject subject);
}
