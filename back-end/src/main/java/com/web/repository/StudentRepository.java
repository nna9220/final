package com.web.repository;

import com.web.entity.Student;
import com.web.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    @Query("SELECT s FROM Student s")
    List<Student> getAllStudent();

    @Query("SELECT S FROM Student S WHERE S.subjectId IS NULL")
    public List<Student> getStudentSubjectNull();

    @Query("SELECT S FROM Student S WHERE S.subjectId=:subject")
    public List<Student> getStudentSubjectGraduationNull(List<Subject> subject);

    @Query("SELECT S FROM Student S WHERE S.subjectId IS NULL")
    public List<Student> getStudentSubjectEssayNull();
}
