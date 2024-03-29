package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.TokenUtils;
import com.web.dto.TokenDto;
import com.web.dto.response.LecturerResponse;
import com.web.dto.response.PersonResponse;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.mapper.PersonMapper;
import com.web.repository.PersonRepository;
import com.web.service.Admin.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class PersonController {
    @Autowired
    PersonService personService;
    @Autowired
    PersonMapper personMapper;
    @Autowired
    private PersonRepository personRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public PersonController (TokenUtils tokenUtils){
        this.tokenUtils= tokenUtils;
    }



//    @PostMapping("/login")
@GetMapping("")
public ResponseEntity<?> getPerson(@RequestHeader("Authorization") String authorizationHeader){
    List<Person> personList = personService.findAll();
    List<PersonResponse> listPer = personMapper.toPersonListDTO(personList);
    System.out.println("Person: " + listPer);
    /*odelAndView model = new ModelAndView("QuanLyNguoiDung");
    model.addObject("listPerson", listPer);*/
    return new ResponseEntity<>(listPer,HttpStatus.OK);
}

    private boolean isValidToken(String token) {
        // Thực hiện kiểm tra token tại đây, có thể sử dụng thư viện bảo mật, so sánh giá trị, vv.
        // Trong ví dụ này, tạm thời giả sử token là hợp lệ nếu không null hoặc trống
        return token != null && !token.isEmpty();
    }

    @GetMapping("/current")
    public ResponseEntity<?> getUser(){
       /* if (CheckedPermission.isAdmin(personRepository)) {*/
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Person currentUser = (Person) authentication.getPrincipal();
            return ResponseEntity.ok(currentUser);
        /*}
        else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }*/
    }
}
