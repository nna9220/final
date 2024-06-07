package com.web.controller;

import com.web.dto.response.LecturerResponse;
import com.web.dto.response.SubjectResponse;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.mapper.LecturerMapper;
import com.web.mapper.SubjectMapper;
import com.web.repository.LecturerRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.LecturerService;
import com.web.service.Admin.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class HomeController {
    @Autowired
    private LecturerService lecturerService;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private LecturerMapper lecturerMapper;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @GetMapping("/home")
    public ResponseEntity<?> getHome(){
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/contact")
    public ModelAndView getContact(){
        ModelAndView model = new ModelAndView("contact");
        return model;
    }
    @GetMapping("/team")
    public ResponseEntity<?> getTeam(){
        List<Lecturer> lecturers = lecturerService.getAllLec();
        List<LecturerResponse> listLec = lecturerMapper.toLecturerListDTO(lecturers);
        System.out.println("Hello");
        return new ResponseEntity<>(lecturers, HttpStatus.OK);
    }

    @GetMapping("/instruction")
    public ResponseEntity<?> getInstruction(){
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/essay/tlcn")
    public List<Subject> getEssayTLCN() {
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
        List<Subject> subjects = subjectRepository.findAllSubject(typeSubject);
        return subjects;
    }

    @GetMapping("/essay/kltn")
    public List<Subject> getEssayKLTN() {
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        List<Subject> subjects = subjectRepository.findAllSubject(typeSubject);
        return subjects;
    }
}
