package com.web.repository;

import com.web.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Integer> {
    @Query("select c from StudentClass c")
    List<StudentClass> getAllStudentClass();
}
