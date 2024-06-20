package com.web.repository;

import com.web.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Integer> {
    @Query("select c from StudentClass c")
    List<StudentClass> getAllStudentClass();
    @Query("select c from StudentClass  c where c.classname=:name")
    StudentClass getStudentClassByClassname(String name);
    @Query("select c from StudentClass c where c.classname = :name")
    Optional<StudentClass> findByClassName(String name);
}
