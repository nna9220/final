package com.web.service.Admin;

import com.web.entity.Student;
import com.web.entity.TypeSubject;
import com.web.exception.NotFoundException;
import com.web.entity.Subject;
import com.web.mapper.SubjectMapper;
import com.web.repository.StudentRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.MailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private StudentRepository studentRepository;
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
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            String subject = "ĐĂNG KÝ ĐỀ TÀI " + oldSubject.getTypeSubject().getTypeName() + " THÀNH CÔNG";
            String messenger = "Topic: " + existSubject.getSubjectName() + " đã được trưởng bộ môn duyệt, vui lòng truy cập website để thực hiện quản lý!!";
            mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
            List<String> emailStudents = new ArrayList<>();
            if (existSubject.getStudent1()!=null){
                Student student = studentRepository.findById(existSubject.getStudent1()).orElse(null);
                emailStudents.add(student.getPerson().getUsername());
            }
            if (existSubject.getStudent2()!=null){
                Student student = studentRepository.findById(existSubject.getStudent2()).orElse(null);
                emailStudents.add(student.getPerson().getUsername());
            }
            if (existSubject.getStudent2()!=null){
                Student student = studentRepository.findById(existSubject.getStudent2()).orElse(null);
                emailStudents.add(student.getPerson().getUsername());
            }
            String subjectStudent = "Topic: " + existSubject.getSubjectName() ;
            String messengerStudent = "Topic: " + existSubject.getSubjectName() + " đã đăng ký thành công, vui lòng truy cập website để thực hiện quản lý!!";
            mailService.sendMailToPerson(emailStudents,subjectStudent,messengerStudent);
            return oldSubject;
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }
}
