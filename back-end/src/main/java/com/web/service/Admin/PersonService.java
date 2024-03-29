package com.web.service.Admin;

import com.web.exception.NotFoundException;
import com.web.entity.Person;
import com.web.entity.RoleName;
import com.web.entity.Roles;
import com.web.mapper.PersonMapper;
import com.web.dto.request.PersonRequest;
import com.web.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {
    @Autowired
    PersonRepository personRepository;
    @Autowired
    PersonMapper personMapper;
    private final String CLASS_NOT_FOUND = "Class not found";
    public List<Person> findAll(){
        return personRepository.findAllPerson();
    }
    public Person savePerson(PersonRequest personRequest){
        var person = personMapper.toEntity(personRequest);
        return personRepository.save(person);
    }
    public Person getUserEmail(String email){
        return personRepository.findUserByEmail(email);
    }

//    public String processOAuthPostLogin(String email){
//        Person existPerson = personRepository.getUserByEmail(email);
//        String url = "";
//        if (existPerson != null) {
//            // Nếu người dùng có trong database
//            String role = existPerson.getRoleId().getName();
//            if (role.equals("admin")){
//                url = "/admin/home";
//            } else if (role.equals("student")) {
//                url = "/student/home";
//            } else if (role.equals("lecturer")) {
//                url = "/lecturer/home";
//            } else if (role.equals("headOfDepartment")) {
//                url = "/headOfDepartment/home";
//            }
//        } else {
//            // Nếu không tìm thấy người dùng, ném ngoại lệ UserNotFoundException
//            throw new UsernameNotFoundException("User not found in the database");
//        }
//        return url;
//    }

    public Person editPerson(String id, PersonRequest personRequest){
        Person oldPerson = personRepository.findById(id).orElse(null);
        if (oldPerson!=null){
            oldPerson.setStatus(personRequest.isStatus());
            oldPerson.setPhone(personRequest.getPhone());
            oldPerson.setLastName(personRequest.getLastName());
            oldPerson.setFirstName(personRequest.getFirstName());
            oldPerson.setBirthDay(String.valueOf(personRequest.getBirthDay()));
            //oldPerson.setRoleId(RoleName.valueOf(personRequest.getRole()));
            return personRepository.save(oldPerson);
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }

    public Person deletePerson(String id){
        Person oldPerson = personRepository.findById(id).orElse(null);
        if (oldPerson!=null){
            oldPerson.setStatus(false);
            return personRepository.save(oldPerson);
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }

    public Person detailPerson(String id){
        Person existedPerson = personRepository.findById(id).orElse(null);
        if (existedPerson!=null){
            return existedPerson;
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }

}
