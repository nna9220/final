package com.web.repository;

import com.web.entity.Comment;
import com.web.entity.Lecturer;
import com.web.entity.ReviewByInstructor;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewByInstructorRepository extends JpaRepository<ReviewByInstructor, Integer> {
    @Query("select r from ReviewByInstructor r where r.subject=:subject")
    public ReviewByInstructor getReviewByInstructorBySAndSubject(Subject subject);
}
