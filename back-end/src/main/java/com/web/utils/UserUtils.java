package com.web.utils;

import com.web.config.SecurityUtils;
import com.web.dto.CustomUserDetails;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
//@Transactional
public class UserUtils implements UserDetailsService {

    @Autowired
    private PersonRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Person> user = userRepository.findByUsername(username);
        if (user.get() == null) {
            throw new UsernameNotFoundException(username);
        }
        return new CustomUserDetails(user.get());
    }

    public Person getUserWithAuthority(){
        String email = SecurityUtils.getCurrentUserLogin().get();
        return userRepository.findByEmail(email).get();
    }

    public String randomKey(){
        String str = "12345667890";
        Integer length = str.length()-1;
        StringBuilder stringBuilder = new StringBuilder("");
        for(int i=0; i<6; i++){
            Integer ran = (int)(Math.random()*length);
            stringBuilder.append(str.charAt(ran));
        }
        return String.valueOf(stringBuilder);
    }
}

