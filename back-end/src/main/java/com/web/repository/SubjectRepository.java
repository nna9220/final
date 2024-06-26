package com.web.repository;

import com.web.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    @Query("select s from Subject s where s.major =:major and s.typeSubject=:typeSubject and s.active=:active")
    public List<Subject> getSubjectByMajor(Major major, TypeSubject typeSubject,byte active);

    @Query("select s from Subject s where s.major =:major and s.typeSubject=:typeSubject")
    public Set<Subject> getSubjectByMajorAnType(Major major, TypeSubject typeSubject);
    @Query("select s from Subject s where s.typeSubject=:type")
    public List<Subject> findAllSubject(TypeSubject type);

    @Query("select s from Subject  s where s.thesisAdvisorId=:id and s.typeSubject=:type")
    public List<Subject> findSubjectsByThesisAdvisorId(Lecturer id, TypeSubject type);

    @Query("select s from Subject s where s.instructorId=:id and s.status=:status and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByLecturerIntro(Lecturer id, Boolean status, TypeSubject typeSubject);

    @Query("select s from Subject s where s.instructorId=:id and s.status=:status and s.typeSubject=:typeSubject and s.active=:active")
    public List<Subject> findSubjectByInstructorAndStatusAndActiveAndTypeSubject(Lecturer id, Boolean status, TypeSubject typeSubject,Byte active);

    @Query("select s from Subject s where s.status=:status and s.major=:major and s.active=:active and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByStatusAndMajorAndActive(boolean status, Major major, Byte active, TypeSubject typeSubject);

    @Query("select s from Subject s where s.checkStudent=false and (s.student1 is null or  s.student2 is null or s.student3 is null) and s.status=:status and s.major=:major and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByStatusAndMajorAndStudent(boolean status, Major major,TypeSubject typeSubject);

    @Query("select s from Subject s where s.thesisAdvisorId IS NULL and s.major=:major and s.status=:status and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByAsisAdvisorAndMajor(boolean status,Major major,TypeSubject typeSubject);

    @Query("select s from Subject s where s.typeSubject=:id")
    public List<Subject> findSubjectByType(TypeSubject id);

    @Query("select s from Subject s where s.active =:active")
    public List<Subject> findSubjectByActive(Byte active);

    @Query("select s from Subject s where s.active >=:active and s.status=true and s.major=:major and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByActiveAndStatusAndMajorAndType(Byte active, Major major, TypeSubject typeSubject);

    @Query("select s from Subject s where s.instructorId=:id and s.status=:status and s.typeSubject=:typeSubject and s.active=:active")
    public List<Subject> findSubjectByThesisAndStatusAndActiveAndTypeSubject(Lecturer id, Boolean status, TypeSubject typeSubject,Byte active);

    @Query("select s from Subject s where s.council=:id and s.status=:status and s.typeSubject=:typeSubject and s.active=:active")
    public List<Subject> findSubjectByCouncilAndStatusAndActiveAndTypeSubject(Council id, Boolean status, TypeSubject typeSubject, Byte active);


    @Query("select s from Subject s where s.major=:major and s.status=:status and s.typeSubject=:typeSubject and s.active=:active")
    public List<Subject> findSubjectByMajorAndStatusAndActiveAndTypeSubject(Major major, Boolean status, TypeSubject typeSubject,Byte active);


    @Query("select s from Subject s where s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByTypeSubject(TypeSubject typeSubject);

    @Query("select s from Subject s where s.active=:active and s.instructorId=:lecturer and s.typeSubject=:typeSubject")
    public List<Subject> findSubjectByActiveAndInstructorIdAndType(Byte active, Lecturer lecturer,TypeSubject typeSubject);

}
