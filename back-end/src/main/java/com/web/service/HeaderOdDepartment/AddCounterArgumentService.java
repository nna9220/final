package com.web.service.HeaderOdDepartment;

import com.web.exception.NotFoundException;
import com.web.entity.Lecturer;
import com.web.entity.Subject;
import com.web.repository.LecturerRepository;
import com.web.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddCounterArgumentService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    private final String CLASS_NOT_FOUND = "Class not found";

    public Subject AddCounterArgument(int id, String lecturerId){
        Subject oldSubject = subjectRepository.findById(id).orElse(null);
        if (oldSubject!=null){
            Lecturer oldLecturer = lecturerRepository.findById(lecturerId).orElse(null);
            if (oldLecturer!=null){
                oldSubject.setThesisAdvisorId(oldLecturer);
                return oldSubject;
            }else {
                throw new NotFoundException(CLASS_NOT_FOUND);
            }
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }
}
