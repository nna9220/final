package com.web.repository;

import com.web.entity.ReviewByInstructor;
import com.web.entity.ReviewByThesis;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewByThesisRepository extends JpaRepository<ReviewByThesis, Integer> {
    @Query("select r from ReviewByThesis r where r.subject=:subject")
    public ReviewByThesis getReviewByThesisBySAndSubject(Subject subject);
}
