package com.web.repository;

import com.web.entity.SchoolYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolYearRepository extends JpaRepository<SchoolYear, Integer> {
    @Query("select y from SchoolYear y")
    List<SchoolYear> getAllSchoolYear();
}
