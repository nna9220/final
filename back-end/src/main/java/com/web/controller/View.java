package com.web.controller;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class View {

    @Autowired
    private PersonRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = {"/create"}, method = RequestMethod.GET)
    public String oke(){
        Person user = new Person();
        user.setUsername("admin");
        user.setPassword(passwordEncoder.encode("admin"));
        user.setActived(true);
        userRepository.save(user);
        return "";
    }
}
