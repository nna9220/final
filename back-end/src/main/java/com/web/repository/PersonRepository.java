package com.web.repository;

import com.web.entity.Authority;
import com.web.entity.Person;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {

    @Query("SELECT p FROM Person p WHERE p.username = ?1")
    Optional<Person> findByUsername(String username);

    @Query("SELECT p FROM Person p")
    List<Person> findAllPerson();

    @Query("SELECT p FROM Person p WHERE p.authorities = :authorities")
    List<Person> findGuest(@Param("authorities") Authority authorities);

    @Query("SELECT p FROM Person p WHERE p.username = :username")
    Person findUsername(@Param("username") String username);

    boolean existsByPersonId(String personId);

    boolean existsByUsername(String username);

    @Query("SELECT p.username FROM Person p WHERE p.authorities.name = 'ROLE_STUDENT'")
    List<String> getAllStudentEmails();

    @Query("SELECT p.username FROM Person p WHERE p.authorities.name = 'ROLE_LECTURER' or p.authorities.name ='ROLE_HEAD'")
    List<String> getAllLecturerEmails();

    List<Person> findByUsernameIn(List<String> usernames); // Sử dụng phương thức In
}
