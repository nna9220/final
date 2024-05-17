package com.web.repository;

import com.web.entity.Council;
import com.web.entity.Lecturer;
import com.web.entity.Subject;
import com.web.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouncilRepository extends JpaRepository<Council, Integer> {
    @Query("select c from Council c where :lecturer MEMBER OF c.lecturers")
    public List<Council> getListCouncilByLecturer(Lecturer lecturer);

    @Query("select c from Council c where c.subject=:subject")
    public Council getListCouncilBySubject(Subject subject);
}
