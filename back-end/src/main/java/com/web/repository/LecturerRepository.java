package com.web.repository;

import com.nimbusds.jose.crypto.impl.MACProvider;
import com.web.entity.Authority;
import com.web.entity.Lecturer;
import com.web.entity.Major;
import com.web.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, String> {
    @Query("SELECT l FROM Lecturer l")
    List<Lecturer> findAllLec();

    @Query("select l from Lecturer l where l.lecturerId <>:lecId")
    List<Lecturer> getListLecturerNotCurrent(String lecId);

    @Query("select l from Lecturer l where l.lecturerId<>:instructorId")
    List<Lecturer> getListLecturerNotLecInstructor( String instructorId);

    @Query("select l from Lecturer l where l.lecturerId <> :lecId and l.lecturerId <> :thesisId")
    List<Lecturer> getListLecturerNotInstructorAndThesis2(@Param("lecId") String lecId, @Param("thesisId") String thesisId);

    @Query("select l from Lecturer l where l.authority =:authority")
    List<Lecturer> getListLecturerISHead(Authority authority);

    @Query("select l from Lecturer l where l.major =:major")
    List<Lecturer> getListLecturerByMajor(Major major);

    @Query("select l from Lecturer l where l.authority =:authority and l.major=:major")
    Lecturer getLecturerISHead(Authority authority, Major major);
}
