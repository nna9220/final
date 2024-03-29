package com.web.service.Lecturer;

import com.web.entity.Lecturer;
import com.web.entity.Major;
import com.web.entity.Subject;
import com.web.mapper.SubjectMapper;
import com.web.dto.request.SubjectRequest;
import com.web.repository.LecturerRepository;
import com.web.repository.SubjectRepository;
import com.web.service.Admin.LecturerService;
import com.web.service.Admin.StudentService;
import com.web.service.Admin.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LecturerSubjectService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private LecturerService lecturerService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private SubjectMapper subjectMapper;

    //Dang ky de tai
    public Subject lecturerRegisterTopic(SubjectRequest subjectRequest){
        try {
            return subjectRepository.save(subjectMapper.toEntity(subjectRequest));

        }catch (Exception e){
            throw e;
        }
    }

}
