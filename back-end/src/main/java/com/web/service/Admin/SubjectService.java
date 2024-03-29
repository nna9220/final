package com.web.service.Admin;

import com.web.exception.NotFoundException;
import com.web.entity.Subject;
import com.web.mapper.SubjectMapper;
import com.web.dto.response.SubjectResponse;
import com.web.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private SubjectMapper subjectMapper;
    private final String CLASS_NOT_FOUND = "Class not found";

    public List<Subject> getAll(){
        return subjectRepository.findAllSubject();
    }

    public Subject browseSubject(int id){
        Subject oldSubject = subjectRepository.findById(id).orElse(null);
        if (oldSubject!= null){
            oldSubject.setStatus(true);
            subjectRepository.save(oldSubject);
            return oldSubject;
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }
}
