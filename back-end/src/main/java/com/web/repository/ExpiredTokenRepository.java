package com.web.repository;

import com.web.entity.Authority;
import com.web.entity.ExpiredToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExpiredTokenRepository extends JpaRepository<ExpiredToken,Integer> {
    ExpiredToken findByToken(String token);

}
