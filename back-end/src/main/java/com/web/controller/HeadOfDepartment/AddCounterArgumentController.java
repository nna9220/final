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
import org.springframework.security.access.prepost.PreAuthorize;
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
import java.util.*;

@RestController
@RequestMapping("/api/head/subject")
@RequiredArgsConstructor
public class AddCounterArgumentController {
    @Autowired
    private SubjectImplService service;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private NotificationRepository notificationRepository;
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
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public void generateExcelReport(HttpServletResponse response, HttpSession session) throws Exception{

        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
        response.setContentType("application/octet-stream");
        LocalDate nowDate = LocalDate.now();

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=subject_" +nowDate+ ".xls";

        response.setHeader(headerKey, headerValue);

        reportService.generateExcel(response, session,typeSubject);
        response.flushBuffer();
    }


    @GetMapping("/listLecturer/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> addCounterArgumrnt(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String lecturerId) {
        try {
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);

            //Check người dùng là head
            if (!personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            // Lấy thông tin môn học
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject == null) {
                return new ResponseEntity<>("Môn học không tồn tại", HttpStatus.NOT_FOUND);
            }

            // Lấy thông tin giảng viên
            Lecturer currentLecturer = lecturerRepository.findById(lecturerId).orElse(null);
            if (currentLecturer == null) {
                return new ResponseEntity<>("Giảng viên không tồn tại", HttpStatus.NOT_FOUND);
            }

            // Tạo mới hội đồng
            Council council = new Council();

            // Tạo CouncilLecturer của GVPB
            CouncilLecturer councilCounterArgument = new CouncilLecturer();
            councilCounterArgument.setLecturer(currentLecturer);
            councilCounterArgument.setRole("Chủ tịch");
            councilCounterArgument.setCouncil(council);

            // Tạo CouncilLecturer của GVHD
            CouncilLecturer councilInstructor = new CouncilLecturer();
            councilInstructor.setLecturer(existedSubject.getInstructorId());
            councilInstructor.setRole("Ủy viên");
            councilInstructor.setCouncil(council);

            // Tạo List CouncilLecturer
            List<CouncilLecturer> councilLecturers = new ArrayList<>();
            councilLecturers.add(councilCounterArgument);
            councilLecturers.add(councilInstructor);

            council.setCouncilLecturers(councilLecturers);
            council.setSubject(existedSubject);

            councilRepository.save(council);

            // Cập nhật thông tin giảng viên
            List<Council> councils = new ArrayList<>();
            councils.add(council);

            Lecturer instructor = existedSubject.getInstructorId();
            instructor.setCouncilLecturers(councilLecturers);

            currentLecturer.setCouncilLecturers(councilLecturers);
            existedSubject.setThesisAdvisorId(currentLecturer);
            existedSubject.setCouncil(council);

            lecturerRepository.save(currentLecturer);
            lecturerRepository.save(instructor);
            subjectRepository.save(existedSubject);
            councilLecturerRepository.save(councilCounterArgument);
            councilLecturerRepository.save(councilInstructor);

            // Gửi email thông báo
            String subject = "THÀNH LẬP HỘI ĐỒNG";
            String message = "HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + existedSubject.getSubjectName() + " ĐÃ ĐƯỢC THÀNH LẬP!";
            List<String> emailRecipients = new ArrayList<>();
            emailRecipients.add(existedSubject.getInstructorId().getPerson().getUsername());
            emailRecipients.add(existedSubject.getThesisAdvisorId().getPerson().getUsername());

            if (!emailRecipients.isEmpty()) {
                mailService.sendMailToPerson(emailRecipients, subject, message);
            }

            return new ResponseEntity<>(existedSubject, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/delete")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> lecturerRegisterTopic(
            @RequestParam("subjectName") String name,
            @RequestParam("requirement") String requirement,
            @RequestParam("expected") String expected,
            @RequestParam(value = "student1", required = false) String student1,
            @RequestParam(value = "student2", required = false) String student2,
            @RequestParam(value = "student3", required = false) String student3,
            @RequestHeader("Authorization") String authorizationHeader,
            HttpServletRequest request) {
        try {
            LocalDateTime current = LocalDateTime.now();
            System.out.println("Current time: " + current);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            System.out.println("Current person: " + personCurrent);

            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            System.out.println("TypeSubject: " + typeSubject);

            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") ||
                    personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {

                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
                System.out.println("Period list: " + periodList);

                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList)) {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 0);
                    newSubject.setStatus(false);

                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    System.out.println("Exist lecturer: " + existLecturer);

                    if (existLecturer != null) {
                        newSubject.setInstructorId(existLecturer);
                        newSubject.setMajor(existLecturer.getMajor());

                        List<Student> studentList = new ArrayList<>();
                        if (student1 != null) {
                            Student studentId1 = studentRepository.findById(student1).orElse(null);
                            if (studentId1 != null) {
                                newSubject.setStudent1(student1);
                                studentId1.setSubjectId(newSubject);
                                studentList.add(studentId1);
                            }
                        }

                        if (student2 != null) {
                            Student studentId2 = studentRepository.findById(student2).orElse(null);
                            if (studentId2 != null) {
                                newSubject.setStudent2(student2);
                                studentId2.setSubjectId(newSubject);
                                studentList.add(studentId2);
                            }
                        }

                        if (student3 != null) {
                            Student studentId3 = studentRepository.findById(student3).orElse(null);
                            if (studentId3 != null) {
                                newSubject.setStudent3(student3);
                                studentId3.setSubjectId(newSubject);
                                studentList.add(studentId3);
                            }
                        }
                        Set<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubject(typeSubject);
                        if (evaluationCriteria!=null){
                            newSubject.setCriteria(evaluationCriteria);
                        }
                        newSubject.setCheckStudent(student1 != null || student2 != null || student3 != null);
                        LocalDate nowDate = LocalDate.now();
                        newSubject.setYear(String.valueOf(nowDate));
                        newSubject.setTypeSubject(typeSubject);

                        subjectRepository.save(newSubject);
                        studentRepository.saveAll(studentList);
                        String subject = "ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG";
                        String messenger = "Topic: " + newSubject.getSubjectName() + " đăng ký thành công vui lòng chờ TBM duyệt đề tài";
                        //Gửi mail cho Hội đồng - SV
                        List<String> emailPerson = new ArrayList<>();
                        emailPerson.add(existLecturer.getPerson().getUsername());
                        List<Person> personList = new ArrayList<>();
                        for (String s:emailPerson) {
                            Person p = personRepository.findUsername(s);
                            if (p!=null){
                                personList.add(p);
                            }
                        }
                        mailService.sendMailToPerson(emailPerson,subject,messenger);
                        Notification notification = new Notification();
                        LocalDateTime now = LocalDateTime.now();
                        notification.setPersons(personList);
                        notification.setDateSubmit(now);
                        notification.setTitle(subject);
                        notification.setContent(messenger);
                        notificationRepository.save(notification);
                        return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
                    } else {
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Lecturer không tồn tại
                    }
                } else {
                    return new ResponseEntity<>(HttpStatus.OK); // Thời gian không hợp lệ
                }
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Không đủ quyền
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/browse/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> browseSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<TimeBrowsOfHead> timeBrowsOfHead = timeBrowseHeadRepository.getListTimeBrowseByStatus(typeSubject);
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

    @GetMapping("/timeApprove")
    public ResponseEntity<?> getTimeApprove(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<TimeBrowsOfHead> timeBrowsOfHead = timeBrowseHeadRepository.getListTimeBrowseByStatus(typeSubject);
            if (CompareTime.isCurrentTimeInBrowseTimeHead(timeBrowsOfHead)) {
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                return new ResponseEntity<>("Không nằm trong thời gian duyệt",HttpStatus.BAD_REQUEST);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> importSubject(@RequestParam("file") MultipartFile file,  @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader), HttpStatus.OK);
    }
}