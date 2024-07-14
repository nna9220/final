package com.web.repository;

import com.web.entity.Major;
import com.web.entity.Student;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    @Query("SELECT s FROM Student s")
    List<Student> getAllStudent();

    @Query("SELECT S FROM Student S WHERE S.subjectId IS NULL")
    public List<Student> getStudentSubjectNull();

    @Query("SELECT S FROM Student S WHERE S.subjectGraduationId is null")
    public List<Student> getStudentSubjectGraduationNull();

    @Query("SELECT S FROM Student S WHERE S.subjectId IS NULL")
    public List<Student> getStudentSubjectEssayNull();

    @Query("SELECT S FROM Student S WHERE S.status=true")
    public List<Student> getListStudentActiveTrue();

    @Query("SELECT s FROM Student s WHERE s.major = :major AND s.subjectId IS NULL AND s.status=true")
    List<Student> findStudentsByMajorAndNoSubject(@Param("major") Major major);

    @Query("SELECT s FROM Student s WHERE s.major = :major AND s.subjectGraduationId IS NULL AND s.status=true AND s.subjectId!=null")
    List<Student> findStudentsByMajorAndNoSubjectForKL(@Param("major") Major major);
}
