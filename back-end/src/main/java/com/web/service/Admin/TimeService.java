package com.web.service.Admin;

import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TimeService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private AuthorityRepository authorityRepository;
    @Autowired
    private ImportStudentCheckRegister importStudentCheckRegister;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    @Autowired
    private CouncilReportTimeRepository councilReportTimeRepository;
    @Autowired
    private ReportSubmissionTimeRepository reportSubmissionTimeRepository;

    private void validateTimePeriods(RegistrationPeriodLectuer registrationPeriodLectuer) {
        LocalDateTime regStart = registrationPeriodLectuer.getRegistrationTimeStart();
        LocalDateTime regEnd = registrationPeriodLectuer.getRegistrationTimeEnd();

        TimeBrowsOfHead timeBrowsOfHead = registrationPeriodLectuer.getTimeBrowsOfHead();
        if (timeBrowsOfHead != null) {
            if (timeBrowsOfHead.getTimeStart().isBefore(regEnd)) {
                System.out.println("TimeBrowsOfHead phải bắt đầu sau khi RegistrationPeriodLectuer kết thúc");
                throw new IllegalArgumentException("TimeBrowsOfHead phải bắt đầu sau khi RegistrationPeriodLectuer kết thúc.");
            }
            if (timeBrowsOfHead.getTimeEnd().isBefore(timeBrowsOfHead.getTimeStart())) {
                System.out.println("Thời gian kết thúc của TimeBrowsOfHead phải sau thời gian bắt đầu");
                throw new IllegalArgumentException("Thời gian kết thúc của TimeBrowsOfHead phải sau thời gian bắt đầu.");
            }
        }

        RegistrationPeriod registrationPeriod = timeBrowsOfHead != null ? timeBrowsOfHead.getRegistrationPeriod() : null;
        if (registrationPeriod != null) {
            if (registrationPeriod.getRegistrationTimeStart().isBefore(timeBrowsOfHead.getTimeEnd())) {
                System.out.println("RegistrationPeriodStudent phải bắt đầu sau khi TimeBrowsOfHead kết thúc");
                throw new IllegalArgumentException("RegistrationPeriod phải bắt đầu sau khi TimeBrowsOfHead kết thúc.");
            }
            if (registrationPeriod.getRegistrationTimeEnd().isBefore(registrationPeriod.getRegistrationTimeStart())) {
                System.out.println("Thời gian kết thúc của RegistrationPeriodStudent phải sau thời gian bắt đầu");
                throw new IllegalArgumentException("Thời gian kết thúc của RegistrationPeriod phải sau thời gian bắt đầu.");
            }
        }

        ReportSubmissionTime reportSubmissionTime = registrationPeriod != null ? registrationPeriod.getReportSubmissionTime() : null;
        if (reportSubmissionTime != null) {
            if (reportSubmissionTime.getReportTimeStart().isBefore(registrationPeriod.getRegistrationTimeEnd())) {
                System.out.println("ReportSubmissionTime phải bắt đầu sau khi RegistrationPeriod kết thúc.");
                throw new IllegalArgumentException("ReportSubmissionTime phải bắt đầu sau khi RegistrationPeriod kết thúc.");
            }
            if (reportSubmissionTime.getReportTimeEnd().isBefore(reportSubmissionTime.getReportTimeStart())) {
                System.out.println("Thời gian kết thúc của ReportSubmissionTime phải sau thời gian bắt đầu.");
                throw new IllegalArgumentException("Thời gian kết thúc của ReportSubmissionTime phải sau thời gian bắt đầu.");
            }
        }

        CouncilReportTime councilReportTime = reportSubmissionTime != null ? reportSubmissionTime.getCouncilReportTime() : null;
        if (councilReportTime != null) {
            if (councilReportTime.getReportTimeStart().isBefore(reportSubmissionTime.getReportTimeEnd())) {
                System.out.println("CouncilReportTime phải bắt đầu sau khi ReportSubmissionTime kết thúc.");
                throw new IllegalArgumentException("CouncilReportTime phải bắt đầu sau khi ReportSubmissionTime kết thúc.");
            }
            if (councilReportTime.getReportTimeEnd().isBefore(councilReportTime.getReportTimeStart())) {
                System.out.println("Thời gian kết thúc của CouncilReportTime phải sau thời gian bắt đầu.");
                throw new IllegalArgumentException("Thời gian kết thúc của CouncilReportTime phải sau thời gian bắt đầu.");
            }
        }
    }

    @Transactional
    public ResponseEntity<?> getListRegistrationLecturerPeriod(TypeSubject typeSubject) {
        List<RegistrationPeriodLectuer> registrationPeriodLectuers = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
        return new ResponseEntity<>(registrationPeriodLectuers, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getDetailAllTimeByRegistrationPeriodLecturer(int id) {
        Map<String, Object> response = new HashMap<>();
        RegistrationPeriodLectuer existedRegistrationPeriodLectuer = registrationPeriodLecturerRepository.findById(id).orElse(null);
        if (existedRegistrationPeriodLectuer != null) {
            response.put("RegistrationLecturer", existedRegistrationPeriodLectuer);
            TimeBrowsOfHead existedTimeBrowsOfHead = timeBrowseHeadRepository.findTimeBrowseOfHeadByRegistrationLecturer(existedRegistrationPeriodLectuer);
            if (existedTimeBrowsOfHead != null) {
                response.put("TimeBrowseOfHead", existedTimeBrowsOfHead);
                RegistrationPeriod existedRegistrationPeriod = registrationPeriodRepository.findRegistrationStudentByTimeBrowseOfHead(existedTimeBrowsOfHead);
                if (existedRegistrationPeriod != null) {
                    response.put("RegistrationStudent", existedRegistrationPeriod);
                    ReportSubmissionTime existedReportSubmissionTime = reportSubmissionTimeRepository.findReportSubmissionTimeByRegistrationStudent(existedRegistrationPeriod);
                    if (existedReportSubmissionTime != null) {
                        response.put("ReportSubmissionTime", existedReportSubmissionTime);
                        CouncilReportTime existedCouncilReportTime = councilReportTimeRepository.findCouncilReportTimeByReportSubmissionTime(existedReportSubmissionTime);
                        if (existedCouncilReportTime != null) {
                            response.put("CouncilReportTime", existedCouncilReportTime);
                            return new ResponseEntity<>(response, HttpStatus.OK);
                        } else {
                            response.put("notfoundCouncilReportTime", "ReportSubmissionTime không tồn tại cho RegistrationPeriodLectuer này.");
                            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                        }
                    } else {
                        response.put("notfoundReportSubmissionTime", "ReportSubmissionTime không tồn tại cho RegistrationPeriodLectuer này.");
                        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                    }
                } else {
                    response.put("notfoundRegistrationStudent", "RegistrationStudent không tồn tại cho RegistrationPeriodLectuer này.");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            } else {
                response.put("notfoundTimeBrowse", "TimeBrowsOfHead không tồn tại cho RegistrationPeriodLectuer này.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } else {
            response.put("notfoundRegistrationLecturer", "RegistrationPeriodLectuer không tồn tại.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    private static LocalDateTime convertToLocalDateTime(String dateString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Lỗi: " + e);
            e.printStackTrace();
            return null;
        }
    }
    public ResponseEntity<?> createAllTime(
            String registrationPeriodLecturerStart,
            String registrationPeriodLecturerEnd,
            String registrationPeriodLecturerName,
            TypeSubject typeSubjectId,

            String timeBrowsOfHeadStart,
            String timeBrowsOfHeadEnd,

            String registrationPeriodStart,
            String registrationPeriodEnd,

            String reportSubmissionTimeStart,
            String reportSubmissionTimeEnd,

            String councilReportTimeStart,
            String councilReportTimeEnd,
            MultipartFile file) throws IOException {
        System.out.println("Data nhận Lecturer: " + registrationPeriodLecturerName + " " + registrationPeriodLecturerStart + " " + registrationPeriodLecturerEnd);
        System.out.println("Data nhận Student: " + registrationPeriodLecturerName + " " + registrationPeriodStart + " " + registrationPeriodEnd);
        System.out.println("Data nhận Report: " + registrationPeriodLecturerName + " " + reportSubmissionTimeStart + " " + reportSubmissionTimeEnd);
        System.out.println("Data nhận Time browse: " + timeBrowsOfHeadStart + " " + timeBrowsOfHeadEnd );
        System.out.println("Data nhận Council: " + registrationPeriodLecturerName + " " + councilReportTimeStart + " " + councilReportTimeEnd);
        System.out.println("File: " + file);

        RegistrationPeriodLectuer registrationPeriodLectuer = new RegistrationPeriodLectuer();
        registrationPeriodLectuer.setRegistrationTimeStart(convertToLocalDateTime(registrationPeriodLecturerStart));
        registrationPeriodLectuer.setRegistrationTimeEnd(convertToLocalDateTime(registrationPeriodLecturerEnd));
        registrationPeriodLectuer.setRegistrationName(registrationPeriodLecturerName);
        registrationPeriodLectuer.setStatus(true);
        registrationPeriodLectuer.setTypeSubjectId(typeSubjectId);

        TimeBrowsOfHead timeBrowsOfHead = new TimeBrowsOfHead();
        timeBrowsOfHead.setTimeStart(convertToLocalDateTime(timeBrowsOfHeadStart));
        timeBrowsOfHead.setTimeEnd(convertToLocalDateTime(timeBrowsOfHeadEnd));
        timeBrowsOfHead.setTypeSubjectId(typeSubjectId);
        timeBrowsOfHead.setStatus(true);

        RegistrationPeriod registrationPeriod = new RegistrationPeriod();
        registrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(registrationPeriodStart));
        registrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(registrationPeriodEnd));
        registrationPeriod.setRegistrationName(registrationPeriodLecturerName);
        registrationPeriod.setStatus(true);
        registrationPeriod.setTypeSubjectId(typeSubjectId);

        ReportSubmissionTime reportSubmissionTime = new ReportSubmissionTime();
        reportSubmissionTime.setReportTimeStart(convertToLocalDateTime(reportSubmissionTimeStart));
        reportSubmissionTime.setReportTimeEnd(convertToLocalDateTime(reportSubmissionTimeEnd));
        reportSubmissionTime.setReportName(registrationPeriodLecturerName);
        reportSubmissionTime.setTypeSubjectId(typeSubjectId);
        reportSubmissionTime.setStatus(true);

        CouncilReportTime councilReportTime = new CouncilReportTime();
        councilReportTime.setReportTimeStart(convertToLocalDateTime(councilReportTimeStart));
        councilReportTime.setReportTimeEnd(convertToLocalDateTime(councilReportTimeEnd));
        councilReportTime.setReportName(registrationPeriodLecturerName);
        councilReportTime.setStatus(true);
        councilReportTime.setTypeSubjectId(typeSubjectId);

        reportSubmissionTime.setCouncilReportTime(councilReportTime);
        reportSubmissionTime.setRegistrationPeriod(registrationPeriod);

        registrationPeriod.setReportSubmissionTime(reportSubmissionTime);
        registrationPeriod.setTimeBrowsOfHead(timeBrowsOfHead);

        timeBrowsOfHead.setRegistrationPeriod(registrationPeriod);
        timeBrowsOfHead.setRegistrationPeriodLecturer(registrationPeriodLectuer);

        registrationPeriodLectuer.setTimeBrowsOfHead(timeBrowsOfHead);

        try {
            validateTimePeriods(registrationPeriodLectuer);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }


        registrationPeriodLecturerRepository.save(registrationPeriodLectuer);
        timeBrowseHeadRepository.save(timeBrowsOfHead);
        registrationPeriodRepository.save(registrationPeriod);
        reportSubmissionTimeRepository.save(reportSubmissionTime);
        councilReportTimeRepository.save(councilReportTime);
        if (file != null && !file.isEmpty()) {
            importStudentCheckRegister.importStudent(file);
        }
        //GỬI MAIL VÀ THÔNG BÁO CHO SINH VIÊN
        List<Student> studentList = studentRepository.getListStudentActiveTrue();
        List<String> emailStudent = new ArrayList<>();
        for (Student student:studentList) {
            emailStudent.add(student.getPerson().getUsername());
        }
        String subject = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubjectId.getTypeName() +  " CHO SINH VIÊN " + registrationPeriod.getRegistrationName();
        String messenger = "Thời gian bắt đầu: " + registrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + registrationPeriod.getRegistrationTimeEnd() + "\n"
                ;

        String subjectReport = "THÔNG BÁO THỜI GIAN NỘP BÁO CÁO " + typeSubjectId.getTypeName() +  " CHO SINH VIÊN " + registrationPeriod.getRegistrationName();
        String messengerReport = "Thời gian bắt đầu: " + reportSubmissionTime.getReportTimeStart()+"\n" +
                "Thời gian kết thúc: " + reportSubmissionTime.getReportTimeEnd() + "\n"
                + "Sau khoảng thời gian này sinh viên sẽ không thể nộp bài";
        if (!emailStudent.isEmpty()){
            mailService.sendMailToStudents(emailStudent,subject,messenger);
            mailService.sendMailToStudents(emailStudent,subjectReport,messengerReport);
        }

        //Tạo thông báo trên web
        String title = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubjectId.getTypeName()  + " CHO SINH VIÊN";
        String content = "Thời gian bắt đầu: " + registrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + registrationPeriod.getRegistrationTimeEnd() + "\n";
        List<Person> personList = new ArrayList<>();
        for (String s:emailStudent) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personList.add(p);
            }
        }
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setPersons(personList);
        notification.setTitle(title);
        LocalDateTime now = LocalDateTime.now();
        notification.setDateSubmit(now);
        notificationRepository.save(notification);

        Notification notificationReport = new Notification();
        notificationReport.setContent(subjectReport);
        notificationReport.setPersons(personList);
        notificationReport.setTitle(messengerReport);
        notificationReport.setDateSubmit(now);
        notificationRepository.save(notificationReport);


        //GỬI MAIL VÀ THÔNG BÁO CHO GIẢNG VIÊN
        List<Lecturer> lecturerList = lecturerRepository.findAll();
        Authority authority = authorityRepository.findByName("ROLE_HEAD");
        List<Lecturer> headList = lecturerRepository.getListLecturerISHead(authority);
        List<String> emailLecturer = new ArrayList<>();
        List<String> emailHead = new ArrayList<>();
        for (Lecturer lecturer:lecturerList) {
            emailLecturer.add(lecturer.getPerson().getUsername());
        }
        for (Lecturer lecturer:headList) {
            emailHead.add(lecturer.getPerson().getUsername());
        }
        String subjectLecturer = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubjectId.getTypeName()+" CHO GIẢNG VIÊN " + registrationPeriodLectuer.getRegistrationName();
        String messengerLecturer = "Thời gian bắt đầu: " + registrationPeriodLectuer.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + registrationPeriodLectuer.getRegistrationTimeEnd() + "\n";

        String subjectHead = "THÔNG BÁO THỜI GIAN DUYỆT ĐỀ TÀI " +typeSubjectId.getTypeName()+ "CHO TRƯỞNG BỘ MÔN ";
        String messengerHead = "Thời gian bắt đầu: " + timeBrowsOfHead.getTimeStart()+"\n" +
                "Thời gian kết thúc: " + timeBrowsOfHead.getTimeEnd() + "\n";

        String subjectCouncil = "THÔNG BÁO THỜI GIAN CÓ THỂ THÀNH LẬP HỘI ĐỒNG CHO ĐỀ TÀI " +typeSubjectId.getTypeName();
        String messengerCouncil = "Thời gian bắt đầu: " + councilReportTime.getReportTimeStart()+"\n" +
                "Thời gian kết thúc: " + councilReportTime.getReportTimeEnd() + "\n";

        if (!emailLecturer.isEmpty()){
            mailService.sendMailToStudents(emailLecturer,subjectLecturer,messengerLecturer);
            mailService.sendMailToStudents(emailHead,subjectHead,messengerHead);
            mailService.sendMailToPerson(emailHead,subjectCouncil,messengerCouncil);
        }
        //Tạo thông báo trên web
        String titleLecturer = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubjectId.getTypeName()+" CHO GIẢNG VIÊN";
        String contentLecturer = "Thời gian bắt đầu: " + registrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + registrationPeriod.getRegistrationTimeEnd() + "\n";
        List<Person> personListLecturer = new ArrayList<>();
        for (String s:emailLecturer) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personListLecturer.add(p);
            }
        }
        List<Person> personListHead = new ArrayList<>();
        for (String s:emailHead) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personListHead.add(p);
            }
        }
        Notification notificationLecturer = new Notification();
        notificationLecturer.setContent(contentLecturer);
        notificationLecturer.setPersons(personListLecturer);
        notificationLecturer.setTitle(titleLecturer);
        notificationLecturer.setDateSubmit(now);
        notificationRepository.save(notificationLecturer);


        Notification notificationHead = new Notification();
        notificationHead.setContent(subjectHead);
        notificationHead.setPersons(personListHead);
        notificationHead.setTitle(messengerHead);
        notificationHead.setDateSubmit(now);
        notificationRepository.save(notificationHead);

        Notification notificationHeadCouncil = new Notification();
        notificationHeadCouncil.setContent(subjectCouncil);
        notificationHeadCouncil.setPersons(personListHead);
        notificationHeadCouncil.setTitle(messengerCouncil);
        notificationHeadCouncil.setDateSubmit(now);
        notificationRepository.save(notificationHeadCouncil);


        return new ResponseEntity<>(registrationPeriodLectuer, HttpStatus.CREATED);
    }

    public ResponseEntity<?> editAllTime(
            int id,
            String registrationTimeStart,
            String registrationTimeEnd,
            String registrationName,

            String timeBrowsOfHeadStart,
            String timeBrowsOfHeadEnd,

            String registrationPeriodStart,
            String registrationPeriodEnd,
            String registrationPeriodName,

            String reportSubmissionTimeStart,
            String reportSubmissionTimeEnd,
            String reportSubmissionTimeName,

            String councilReportTimeStart,
            String councilReportTimeEnd,
            String councilReportTimeName,
            MultipartFile file,
            TypeSubject typeSubject) throws IOException {

        RegistrationPeriodLectuer existedRegistrationPeriodLectuer = registrationPeriodLecturerRepository.findById(id).orElse(null);
        if (existedRegistrationPeriodLectuer == null) {
            return new ResponseEntity<>("RegistrationPeriodLectuer không tồn tại.", HttpStatus.NOT_FOUND);
        }

        // Check and update Registration Lecturer
        if (registrationTimeStart != null) {
            existedRegistrationPeriodLectuer.setRegistrationTimeStart(convertToLocalDateTime(registrationTimeStart));
        }
        if (registrationTimeEnd != null) {
            existedRegistrationPeriodLectuer.setRegistrationTimeEnd(convertToLocalDateTime(registrationTimeEnd));
        }
        if (registrationName != null) {
            existedRegistrationPeriodLectuer.setRegistrationName(registrationName);
        }

        TimeBrowsOfHead existedTimeBrowsOfHead = timeBrowseHeadRepository.findTimeBrowseOfHeadByRegistrationLecturer(existedRegistrationPeriodLectuer);
        if (existedTimeBrowsOfHead == null) {
            return new ResponseEntity<>("TimeBrowsOfHead không tồn tại.", HttpStatus.NOT_FOUND);
        }

        // Check and update Time Browse
        if (timeBrowsOfHeadStart != null) {
            existedTimeBrowsOfHead.setTimeStart(convertToLocalDateTime(timeBrowsOfHeadStart));
        }
        if (timeBrowsOfHeadEnd != null) {
            existedTimeBrowsOfHead.setTimeEnd(convertToLocalDateTime(timeBrowsOfHeadEnd));
        }

        RegistrationPeriod existedRegistrationPeriod = registrationPeriodRepository.findRegistrationStudentByTimeBrowseOfHead(existedTimeBrowsOfHead);
        if (existedRegistrationPeriod == null) {
            return new ResponseEntity<>("RegistrationPeriodStudent không tồn tại.", HttpStatus.NOT_FOUND);
        }

        // Check and update Registration Student
        if (registrationPeriodStart != null) {
            existedRegistrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(registrationPeriodStart));
        }
        if (registrationPeriodEnd != null) {
            existedRegistrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(registrationPeriodEnd));
        }
        if (registrationPeriodName != null) {
            existedRegistrationPeriod.setRegistrationName(registrationPeriodName);
        }

        ReportSubmissionTime existedReportSubmissionTime = reportSubmissionTimeRepository.findReportSubmissionTimeByRegistrationStudent(existedRegistrationPeriod);
        if (existedReportSubmissionTime == null) {
            return new ResponseEntity<>("ReportSubmissionTime không tồn tại.", HttpStatus.NOT_FOUND);
        }

        // Check and update Report Submission Time
        if (reportSubmissionTimeStart != null) {
            existedReportSubmissionTime.setReportTimeStart(convertToLocalDateTime(reportSubmissionTimeStart));
        }
        if (reportSubmissionTimeEnd != null) {
            existedReportSubmissionTime.setReportTimeEnd(convertToLocalDateTime(reportSubmissionTimeEnd));
        }
        if (reportSubmissionTimeName != null) {
            existedReportSubmissionTime.setReportName(reportSubmissionTimeName);
        }

        CouncilReportTime existedCouncilReportTime = councilReportTimeRepository.findCouncilReportTimeByReportSubmissionTime(existedReportSubmissionTime);
        if (existedCouncilReportTime == null) {
            return new ResponseEntity<>("CouncilReportTime không tồn tại.", HttpStatus.NOT_FOUND);
        }

        // Check and update Council Report Time
        if (councilReportTimeStart != null) {
            existedCouncilReportTime.setReportTimeStart(convertToLocalDateTime(councilReportTimeStart));
        }
        if (councilReportTimeEnd != null) {
            existedCouncilReportTime.setReportTimeEnd(convertToLocalDateTime(councilReportTimeEnd));
        }
        if (councilReportTimeName != null) {
            existedCouncilReportTime.setReportName(councilReportTimeName);
        }

        try {
            validateTimePeriods(existedRegistrationPeriodLectuer);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        councilReportTimeRepository.save(existedCouncilReportTime);
        reportSubmissionTimeRepository.save(existedReportSubmissionTime);
        registrationPeriodRepository.save(existedRegistrationPeriod);
        timeBrowseHeadRepository.save(existedTimeBrowsOfHead);
        registrationPeriodLecturerRepository.save(existedRegistrationPeriodLectuer);
        if (file != null && !file.isEmpty()) {
            importStudentCheckRegister.importStudent(file);
        }

        //GỬI MAIL VÀ THÔNG BÁO CHO SINH VIÊN
        List<Student> studentList = studentRepository.getListStudentActiveTrue();
        List<String> emailStudent = new ArrayList<>();
        for (Student student:studentList) {
            emailStudent.add(student.getPerson().getUsername());
        }
        String subject = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubject.getTypeName() +  " CHO SINH VIÊN " + existedRegistrationPeriod.getRegistrationName();
        String messenger = "Thời gian bắt đầu: " + existedRegistrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedRegistrationPeriod.getRegistrationTimeEnd() + "\n"
                ;

        String subjectReport = "THÔNG BÁO CẬP NHẬT THỜI GIAN NỘP BÁO CÁO " + typeSubject.getTypeName() +  " CHO SINH VIÊN " + existedRegistrationPeriod.getRegistrationName();
        String messengerReport = "Thời gian bắt đầu: " + existedReportSubmissionTime.getReportTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedReportSubmissionTime.getReportTimeEnd() + "\n"
                + "Sau khoảng thời gian này sinh viên sẽ không thể nộp bài";
        if (!emailStudent.isEmpty()){
            mailService.sendMailToStudents(emailStudent,subject,messenger);
            mailService.sendMailToStudents(emailStudent,subjectReport,messengerReport);
        }

        //Tạo thông báo trên web
        String title = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubject.getTypeName()  + " CHO SINH VIÊN";
        String content = "Thời gian bắt đầu: " + existedRegistrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedRegistrationPeriod.getRegistrationTimeEnd() + "\n";
        List<Person> personList = new ArrayList<>();
        for (String s:emailStudent) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personList.add(p);
            }
        }
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setPersons(personList);
        notification.setTitle(title);
        LocalDateTime now = LocalDateTime.now();
        notification.setDateSubmit(now);
        notificationRepository.save(notification);

        Notification notificationReport = new Notification();
        notificationReport.setContent(subjectReport);
        notificationReport.setPersons(personList);
        notificationReport.setTitle(messengerReport);
        notificationReport.setDateSubmit(now);
        notificationRepository.save(notificationReport);

        //GỬI MAIL VÀ THÔNG BÁO CHO GIẢNG VIÊN
        List<Lecturer> lecturerList = lecturerRepository.findAll();
        Authority authority = authorityRepository.findByName("ROLE_HEAD");
        List<Lecturer> headList = lecturerRepository.getListLecturerISHead(authority);
        List<String> emailLecturer = new ArrayList<>();
        List<String> emailHead = new ArrayList<>();
        for (Lecturer lecturer:lecturerList) {
            emailLecturer.add(lecturer.getPerson().getUsername());
        }
        for (Lecturer lecturer:headList) {
            emailHead.add(lecturer.getPerson().getUsername());
        }
        String subjectLecturer = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubject.getTypeName()+" CHO GIẢNG VIÊN " + existedRegistrationPeriodLectuer.getRegistrationName();
        String messengerLecturer = "Thời gian bắt đầu: " + existedRegistrationPeriodLectuer.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedRegistrationPeriodLectuer.getRegistrationTimeEnd() + "\n";

        String subjectHead = "THÔNG BÁO CẬP NHẬT THỜI GIAN DUYỆT ĐỀ TÀI " +typeSubject.getTypeName()+ "CHO TRƯỞNG BỘ MÔN ";
        String messengerHead = "Thời gian bắt đầu: " + existedTimeBrowsOfHead.getTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedTimeBrowsOfHead.getTimeEnd() + "\n";

        String subjectCouncil = "THÔNG BÁO CẬP NHẬT THỜI GIAN CÓ THỂ THÀNH LẬP HỘI ĐỒNG CHO ĐỀ TÀI " +typeSubject.getTypeName();
        String messengerCouncil = "Thời gian bắt đầu: " + existedCouncilReportTime.getReportTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedCouncilReportTime.getReportTimeEnd() + "\n";

        if (!emailLecturer.isEmpty()){
            mailService.sendMailToStudents(emailLecturer,subjectLecturer,messengerLecturer);
            mailService.sendMailToStudents(emailHead,subjectHead,messengerHead);
            mailService.sendMailToPerson(emailHead,subjectCouncil,messengerCouncil);
        }
        //Tạo thông báo trên web
        String titleLecturer = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI " + typeSubject.getTypeName()+" CHO GIẢNG VIÊN";
        String contentLecturer = "Thời gian bắt đầu: " + existedRegistrationPeriod.getRegistrationTimeStart()+"\n" +
                "Thời gian kết thúc: " + existedRegistrationPeriod.getRegistrationTimeEnd() + "\n";
        List<Person> personListLecturer = new ArrayList<>();
        for (String s:emailLecturer) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personListLecturer.add(p);
            }
        }
        List<Person> personListHead = new ArrayList<>();
        for (String s:emailHead) {
            Person p = personRepository.findUsername(s);
            if (p!=null){
                personListHead.add(p);
            }
        }
        Notification notificationLecturer = new Notification();
        notificationLecturer.setContent(contentLecturer);
        notificationLecturer.setPersons(personListLecturer);
        notificationLecturer.setTitle(titleLecturer);
        notificationLecturer.setDateSubmit(now);
        notificationRepository.save(notificationLecturer);

        Notification notificationHead = new Notification();
        notificationHead.setContent(messengerHead);
        notificationHead.setPersons(personListHead);
        notificationHead.setTitle(subjectHead);
        notificationHead.setDateSubmit(now);
        notificationRepository.save(notificationHead);

        Notification notificationHeadCouncil = new Notification();
        notificationHeadCouncil.setContent(messengerCouncil);
        notificationHeadCouncil.setPersons(personListHead);
        notificationHeadCouncil.setTitle(subjectCouncil);
        notificationHeadCouncil.setDateSubmit(now);
        notificationRepository.save(notificationHeadCouncil);
        return new ResponseEntity<>(existedRegistrationPeriodLectuer, HttpStatus.OK);
    }
}