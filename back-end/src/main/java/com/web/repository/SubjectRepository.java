package com.web.repository;

import com.web.entity.Lecturer;
import com.web.entity.Major;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    @Query("select s from Subject s where s.major =:major")
    public List<Subject> getSubjectByMajor(Major major);
    @Query("select s from Subject s")
    public List<Subject> findAllSubject();

    @Query("select s from Subject  s where s.thesisAdvisorId=:id")
    public List<Subject> findSubjectsByThesisAdvisorId(Lecturer id);

    @Query("select s from Subject s where s.instructorId=:id and s.status=:status")
    public List<Subject> findSubjectByLecturerIntro(Lecturer id, Boolean status);

    @Query("select s from Subject s where s.status=:status and s.major=:major and s.active=:active")
    public List<Subject> findSubjectByStatusAndMajorAndActive(boolean status, Major major, Byte active);

    @Query("select s from Subject s where (s.student1 is null or  s.student2 is null) and s.status=:status and s.major=:major")
    public List<Subject> findSubjectByStatusAndMajorAndStudent(boolean status, Major major);


    @Query("select s from Subject s where s.thesisAdvisorId IS NULL and s.major=:major and s.status=:status")
    public List<Subject> findSubjectByAsisAdvisorAndMajor(boolean status,Major major);
}
