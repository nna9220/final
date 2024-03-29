package com.web.service.Admin;

import com.web.entity.StudentClass;
import com.web.mapper.StudentClassMapper;
import com.web.dto.request.StudentClassRequest;
import com.web.repository.StudentClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentClassService {
    @Autowired
    private StudentClassRepository studentClassRepository;
    @Autowired
    private StudentClassMapper studentClassMapper;
    public StudentClass createStudentClass(StudentClassRequest studentClassRequest){
        var studentClass = studentClassMapper.toEntity(studentClassRequest);
        return studentClassRepository.save(studentClass);
    }
    public List<StudentClass> findAll(){
        return studentClassRepository.getAllStudentClass();
    }

    public StudentClass getStudentClassById(int id){
        return studentClassRepository.findById(id).orElse(null);
    }

    public StudentClass editStudentClass(StudentClass studentClass){
        return studentClassRepository.save(studentClass);
    }
}
