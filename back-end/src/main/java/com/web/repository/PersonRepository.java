package com.web.repository;

import com.web.entity.Authority;
import com.web.entity.Person;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person,String> {

    @Query(value = "select u from Person u where u.username = ?1")
    Optional<Person> findByUsername(String username);

    @Query("SELECT p FROM Person p")
    List<Person> findAllPerson();

    @Query("select p from Person p where p.authorities=:authorities")
    public List<Person> findGuest(Authority authorities);

    @Query("SELECT p FROM Person p WHERE p.username=:username")
    public Person findUsername(@Param("username") String username);

}
