package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface CouncilRepository extends JpaRepository<Council, Integer> {
    @Query("SELECT c FROM Council c JOIN c.councilLecturers cl WHERE cl.lecturer = :lecturer")
    List<Council> getListCouncilByLecturer(Lecturer lecturer);

    @Query("select c from Council c where c.subject=:subject")
    public Council getListCouncilBySubject(Subject subject);

    @Query("select c from Council c where c.start=:start and c.end=:end")
    List<Council> findByStartAndEnd(LocalTime start, LocalTime end);

    @Query("select c from Council c where c.subject.typeSubject=:typeSubject")
    List<Council> findByTypeSubject(TypeSubject typeSubject);
}
