package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.dto.response.TypeSubjectResponse;
import com.web.entity.TypeSubject;
import com.web.mapper.TypeSubjectMapper;
import com.web.dto.request.TypeSubjectRequest;
import com.web.repository.PersonRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.TypeSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
//Bảng cứng, không thực hiện thêm
@RestController
@RequestMapping("/api/admin/typeSubject")
public class TypeSubjectController {
    @Autowired
    private TypeSubjectService typeSubjectService;
    @Autowired
    private TypeSubjectMapper typeSubjectMapper;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getTypeSub(){
        List<TypeSubject> typeSubjects = typeSubjectService.findAll();
        List<TypeSubjectResponse> listType = typeSubjectMapper.toTypeSubjectListDTO(typeSubjects);
        return new ResponseEntity<>(listType,HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> saveTypeSubject(@RequestParam("typeName") String typeName){
        /*if (CheckedPermission.isAdmin(personRepository)) {*/
        TypeSubject typeSubject = new TypeSubject();
            typeSubject.setTypeName(typeName);
            typeSubjectRepository.save(typeSubject);
            return new ResponseEntity<>(typeSubject, HttpStatus.CREATED);
    }

}
