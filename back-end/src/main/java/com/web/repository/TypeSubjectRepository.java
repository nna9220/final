package com.web.repository;

import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypeSubjectRepository extends JpaRepository<TypeSubject, Integer> {
    @Query("select t from TypeSubject t")
    public List<TypeSubject> getAllTypeSubject();

    @Query("select s from TypeSubject s where s.typeName=:id")
    public TypeSubject findSubjectByName(String id);
}
