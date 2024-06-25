package com.web.service.Admin;

import com.web.entity.TypeSubject;
import com.web.exception.NotFoundException;
import com.web.entity.Subject;
import com.web.mapper.SubjectMapper;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    private final String CLASS_NOT_FOUND = "Class not found";

    public List<Subject> getAll(){
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
        return subjectRepository.findAllSubject(typeSubject);
    }

    public Subject browseSubject(int id){
        Subject oldSubject = subjectRepository.findById(id).orElse(null);
        if (oldSubject!= null){
            oldSubject.setStatus(true);
            if (oldSubject.getStudent1()==null && oldSubject.getStudent2()==null && oldSubject.getStudent3()==null){
                oldSubject.setCheckStudent(false);
                oldSubject.setActive((byte)0);
            }
            if (oldSubject.getCheckStudent()){
                oldSubject.setActive((byte)1);
            }
            subjectRepository.save(oldSubject);
            return oldSubject;
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }
}
