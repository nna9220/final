package com.web.service;


import com.web.dto.CustomUserDetails;
import com.web.dto.TokenDto;
import com.web.entity.Authority;
import com.web.entity.Person;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.AuthorityRepository;
import com.web.repository.PersonRepository;
import com.web.utils.Contains;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.*;

@Component
public class UserService {

    @Autowired
    private PersonRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public TokenDto login(String username, String password) throws Exception {
        Optional<Person> users = userRepository.findByUsername(username);
        // check infor user
        checkUser(users);
        if(passwordEncoder.matches(password, users.get().getPassword())){
            CustomUserDetails customUserDetails = new CustomUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(users.get());
            return tokenDto;
        }
        else{
            throw new MessageException("Mật khẩu không chính xác", 400);
        }
    }




    public Boolean checkUser(Optional<Person> users){
        if(users.isPresent() == false){
            throw new MessageException("Không tìm thấy tài khoản", 404);
        }
        else if(users.get().getActived() == false){
            throw new MessageException("Tài khoản đã bị khóa", 500);
        }
        return true;
    }
}
