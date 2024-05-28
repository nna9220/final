package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.Admin.SubjectService;
import com.web.service.MailServiceImpl;
import com.web.service.ReportService;
import com.web.service.SubjectImplService;
import com.web.utils.Contains;
import com.web.utils.ExcelUtils;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head/subject")
@RequiredArgsConstructor
public class AddCounterArgumentController {
    @Autowired
    private SubjectImplService service;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private TimeAddSubjectHeadRepository timeAddSubjectHeadRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private ReportService reportService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;

    private final TokenUtils tokenUtils;

    @GetMapping("/export")
    public void generateExcelReport(HttpServletResponse response, HttpSession session) throws Exception{

        response.setContentType("application/octet-stream");
        LocalDate nowDate = LocalDate.now();

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=subject_" +nowDate+ ".xls";

        response.setHeader(headerKey, headerValue);

        reportService.generateExcel(response, session);
        response.flushBuffer();
    }


    @GetMapping("/listLecturer/{subjectId}")
    public ResponseEntity<Map<String,Object>> getAddCounterArgument(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Lecturer> lecturerList = lecturerRepository.getListLecturerNotCurrent(currentSubject.getInstructorId().getLecturerId());
            Map<String,Object> response = new HashMap<>();
            response.put("listLecturer", lecturerList);
            response.put("person",personCurrent);
            response.put("subject", currentSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listAdd")
    public ResponseEntity<Map<String,Object>> getListSubjectAddCounterArgument(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByAsisAdvisorAndMajor(true,existedLecturer.getMajor(),typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Phân Giảng viên phản biện - TLCN
    @PostMapping("/addCounterArgumrnt/{subjectId}/{lecturerId}")
    public ResponseEntity<?> addCounterArgumrnt(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String lecturerId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject != null) {
                Lecturer currentLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                List<Subject> addSub = new ArrayList<>();
                addSub.add(existedSubject);
                if (currentLecturer != null) {
                    //Tạo list GV để thêm vào hội đồng
                    List<Lecturer> lecturers = new ArrayList<>();
                    lecturers.add(currentLecturer);
                    lecturers.add(existedSubject.getInstructorId());
                    //Tạo mới hội đồng
                    Council council = new Council();
                    council.setLecturers(lecturers);
                    council.setSubject(existedSubject);
                    councilRepository.save(council);
                    System.out.println("council: " + council.getCouncilId());
                    List<Council> councils = new ArrayList<>();
                    councils.add(council);
                    //set GVHD và GVPB
                    Lecturer instructor = existedSubject.getInstructorId();
                    instructor.setCouncils(councils);
                    currentLecturer.setCouncils(councils);
                    existedSubject.setThesisAdvisorId(currentLecturer);
                    existedSubject.setCouncil(council);
                    lecturerRepository.save(currentLecturer);
                    lecturerRepository.save(instructor);
                    subjectRepository.save(existedSubject);
                    //Mail thông báo hội đồng đã được lập
                    String subject = "THÀNH LẬP HỘI ĐỒNG";
                    String messenger = "HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " +existedSubject.getSubjectName() + " ĐÃ ĐƯỢC THÀNH LẬP!" ;
                    List<String> emailPerson = new ArrayList<>();
                    emailPerson.add(existedSubject.getInstructorId().getPerson().getUsername());
                    emailPerson.add(existedSubject.getThesisAdvisorId().getPerson().getUsername());
                    if (!emailPerson.isEmpty()){
                        mailService.sendMailToPerson(emailPerson,subject,messenger);
                    }
                }
            }
            return new ResponseEntity<>(existedSubject, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/delete")
    public ResponseEntity<Map<String,Object>> getDanhSachDeTaiDaXoa(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByStatusAndMajorAndActive(false,existedLecturer.getMajor(),(byte) 0,typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("lstSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getDanhSachDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByStatusAndMajorAndActive(false,existedLecturer.getMajor(),(byte) 1,typeSubject);

            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject", subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listStudent")
    public ResponseEntity<?> getListStudent(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            List<Student> studentList = studentRepository.getStudentSubjectNull();
            return new ResponseEntity<>(studentList, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/periodHead")
    public ResponseEntity<?> getPeriod(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
            return new ResponseEntity<>(registrationPeriods, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> lecturerRegisterTopic(@RequestParam("subjectName") String name,
                                                   @RequestParam("requirement") String requirement,
                                                   @RequestParam("expected") String expected,
                                                   @RequestParam(value = "student1", required = false) String student1,
                                                   @RequestParam(value = "student2", required = false) String student2,
                                                   @RequestParam(value = "student3", required = false) String student3,
                                                   @RequestHeader("Authorization") String authorizationHeader,
                                                   HttpServletRequest request) {

        try {
            LocalDateTime current = LocalDateTime.now();
            System.out.println(current);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            System.out.println("Trước if check role");
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
                System.out.println("Sau if check role, trước if check time");
                System.out.println(CompareTime.isCurrentTimeInPeriodSLecturer(periodList));
                List<TimeAddSubjectOfHead> timeAddSubjectOfHead = timeAddSubjectHeadRepository.findAllPeriodEssay(typeSubject);
                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList) && CompareTime.isCurrentTimeInAddSubjectTimeHead(timeAddSubjectOfHead)) {
                    System.out.println("sau if check time");
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 0);
                    newSubject.setStatus(false);
                    //Tìm kiếm giảng viên hiện tại
                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    System.out.println("GV: " + existLecturer);
                    newSubject.setInstructorId(existLecturer);
                    newSubject.setMajor(existLecturer.getMajor());
                    List<Student> studentList = new ArrayList<>();
                    //Tìm sinh viên qua mã sinh viên
                    if (student1!=null) {
                        Student studentId1 = studentRepository.findById(student1).orElse(null);
                        newSubject.setStudent1(student1);
                        studentId1.setSubjectId(newSubject);
                        newSubject.setCheckStudent(true);
                        studentList.add(studentId1);
                    }
                    if (student2!=null) {
                        Student studentId2 = studentRepository.findById(student2).orElse(null);
                        newSubject.setStudent2(student2);
                        studentId2.setSubjectId(newSubject);
                        newSubject.setCheckStudent(true);
                        studentList.add(studentId2);
                    }
                    if (student3!=null) {
                        Student studentId3 = studentRepository.findById(student3).orElse(null);
                        newSubject.setStudent1(student3);
                        studentId3.setSubjectId(newSubject);
                        newSubject.setCheckStudent(true);
                        studentList.add(studentId3);
                    }
                    if (student1==null){
                        newSubject.setCheckStudent(false);
                    }else {
                        newSubject.setCheckStudent(true);
                    }
                    LocalDate nowDate = LocalDate.now();
                    newSubject.setYear(String.valueOf(nowDate));
                    newSubject.setTypeSubject(typeSubject);
                    subjectRepository.save(newSubject);
                    studentRepository.saveAll(studentList);
                    System.out.println("Đề tài: "+newSubject.getSubjectName());
                    return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
                }else {
                    return new ResponseEntity<>(personCurrent,HttpStatus.OK);
                }
            }
            else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/browse/{id}")
    public ResponseEntity<?> browseSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            TimeBrowsOfHead timeBrowsOfHead = timeBrowseHeadRepository.findById(1).orElse(null);
            if (CompareTime.isCurrentTimeInBrowseTimeHead(timeBrowsOfHead)) {
                subjectService.browseSubject(id);
                Subject existSubject = subjectRepository.findById(id).orElse(null);
                String subject = "Topic: " + existSubject.getSubjectName();
                String messenger = "Topic: " + existSubject.getSubjectName() + " đã được duyệt!!";
                mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                return new ResponseEntity<>("Không nằm trong thời gian duyệt",HttpStatus.BAD_REQUEST);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            existSubject.setActive((byte) -1);
            subjectRepository.save(existSubject);

            String subject = "Topic: " + existSubject.getSubjectName() ;
            String messenger = "Topic: " + existSubject.getSubjectName() + " đã bị xóa!!";
            mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);

            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importSubject(@RequestParam("file") MultipartFile file,  @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader), HttpStatus.OK);
    }
}