package com.web.config;

import com.web.entity.Person;
import com.web.repository.PersonRepository;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.http.HttpSession;

public class CheckRole {


    public static Person getRoleCurrent(HttpSession session, UserUtils userUtils, PersonRepository personRepository){
        String token = (String) session.getAttribute("token");
        Claims claims = JwtUtils.extractClaims(token, "f2f1035db6a255e7885838b020f370d702d4bb0f35a368f06ded1ce8e6684a27");
        UserDetails email = userUtils.loadUserByUsername(claims.getSubject());
        return personRepository.findUserByEmail(email.getUsername());
    }

    public static Person getRoleCurrent2(String token, UserUtils userUtils, PersonRepository personRepository){
        Claims claims = JwtUtils.extractClaims(token, "f2f1035db6a255e7885838b020f370d702d4bb0f35a368f06ded1ce8e6684a27");
        UserDetails email = userUtils.loadUserByUsername(claims.getSubject());
        return personRepository.findUserByEmail(email.getUsername());
    }
}
