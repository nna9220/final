package com.web.service.HeaderOdDepartment;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ManageCouncilService {
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private CouncilReportTimeRepository councilReportTimeRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private MailServiceImpl mailService;

    public ResponseEntity<?> getListSubject(String authorizationHeader, TypeSubject typeSubject) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(typeSubject, true);
            if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                return new ResponseEntity<>("Không nằm trong khoảng thời gian hội đồng được tổ chức.", HttpStatus.BAD_REQUEST);
            }
            Lecturer lecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> subjects = subjectRepository.findSubjectByActiveAndStatusAndMajorAndType((byte)1, lecturer.getMajor(), typeSubject);
            return new ResponseEntity<>(subjects, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    private static LocalDateTime convertToLocalDateTime(String dateString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            // Xử lý ngoại lệ khi có lỗi trong quá trình chuyển đổi
            System.out.println("Lỗi: " + e);
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp
        }
    }
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
    public static LocalTime convertToTime(String timeString) {
        try {
            return LocalTime.parse(timeString, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Lỗi: Không thể chuyển đổi chuỗi thời gian thành LocalTime. Chi tiết: " + e.getMessage());
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp nếu cần
        }
    }

    public ResponseEntity<?> createNewCouncil(int id,String authorizationHeader,String timeReport, String addressReport,
                                              List<String> lecturer){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject!=null){
                if (subject.getCouncil()!=null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);
                    List<Lecturer> lecturers = new ArrayList<>();
                    for (String lecturerId:lecturer) {
                        Lecturer existedLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                        if (existedLecturer!=null){
                            lecturers.add(existedLecturer);
                        }
                    }
                    //council.setLecturers(lecturers);
                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);
                    List<String> emailPerson = new ArrayList<>();
                    String subjectMail = "HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + subject.getSubjectName();
                    String messenger = "Đã được phân hội đồng phản biện đề tài: " + subject.getSubjectName();
                    /*for (Lecturer l: council.getLecturers()) {
                        emailPerson.add(l.getPerson().getUsername());
                    }*/
                    if (!emailPerson.isEmpty()){
                        mailService.sendMailToPerson(emailPerson,subjectMail,messenger);
                    }

                    return new ResponseEntity<>(council,HttpStatus.CREATED);
                }else{
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    public ResponseEntity<?> getDetailCouncilReportTime(TypeSubject typeSubject){
        List<CouncilReportTime> existedCouncilReportTime = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(typeSubject,true);
        if (existedCouncilReportTime.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);//k nằm trong tgian lập hội đồng nào
        }
        return new ResponseEntity<>(existedCouncilReportTime,HttpStatus.OK);
    }

    public boolean hasTimeConflict(Council council, List<Council> conflictCouncils) {
        LocalTime start1 = council.getStart();
        LocalTime end1 = council.getEnd();
        LocalDate date1 = council.getDate();

        for (Council otherCouncil : conflictCouncils) {
            LocalDate date2 = otherCouncil.getDate();
            LocalTime start2 = otherCouncil.getStart();
            LocalTime end2 = otherCouncil.getEnd();

            // Kiểm tra xem có sự chồng chéo giữa khoảng thời gian start1-end1 và start2-end2
            if (date1.equals(date2) && start1.isBefore(end2) && start2.isBefore(end1)) {
                return true; // Có xung đột
            }
        }

        return false; // Không có xung đột
    }

    public static LocalDate convertStringToLocalDate(String dateString) {
        String pattern = "dd/MM/yyyy";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        try {
            return LocalDate.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date format: " + e.getMessage());
            return null;
        }
    }

    //Chỉnh sửa thêm timeStart and timeEnd, check trong 1 thời gian k được có 2 hội đồng cùng phản biện
    public ResponseEntity<?> updateCouncil(int id,String authorizationHeader, String date,String timeStart, String timeEnd, String addressReport,
                                              String lecturer1, String lecturer2,String lecturer3,String lecturer4,String lecturer5){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject!=null){
                List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(subject.getTypeSubject(),true);

                if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                    return new ResponseEntity<>("Không nằm trong khoảng thời gian tạo hội đồng", HttpStatus.BAD_GATEWAY);
                }
                if (subject.getCouncil()!=null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);
                    // Kiểm tra xem có Council khác có cùng timeStart và timeEnd không
                    TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
                    //Tìm các đề tài của KLTN
                    List<Subject> subjects = subjectRepository.findSubjectByType(typeSubject);
                    //Lấy danh sách council của các subject này ra
                    List<Council> conflictCouncil = new ArrayList<>();
                    for (Subject s:subjects) {
                        //Kiểm tra các subject có council  và có time đã được set
                        if (s.getCouncil()!=null) {
                            if (s.getCouncil().getStart()!=null && s.getCouncil().getEnd()!=null) {
                                conflictCouncil.add(s.getCouncil());
                            }
                        }
                    }

                    council.setStart(convertToTime(timeStart));
                    council.setEnd(convertToTime(timeEnd));
                    council.setDate(convertStringToLocalDate(date));
                    if (hasTimeConflict(council,conflictCouncil)) {
                        return new ResponseEntity<>("Đã tồn tại hội đồng nằm trong khoản tời gian này.", HttpStatus.CONFLICT);
                    }
                    // Xóa CouncilLecturer cũ của giảng viên nếu có sự thay đổi
                    removeCouncilLecturerIfNeeded(council, lecturer1);
                    removeCouncilLecturerIfNeeded(council, lecturer2);
                    removeCouncilLecturerIfNeeded(council, lecturer3);
                    removeCouncilLecturerIfNeeded(council, lecturer4);
                    removeCouncilLecturerIfNeeded(council, lecturer5);
                    // Thêm giảng viên mới vào CouncilLecturer nếu có sự thay đổi
                    addOrUpdateCouncilLecturer(council, lecturer1, "Chủ tịch");
                    addOrUpdateCouncilLecturer(council, lecturer2, "Ủy viên");
                    addOrUpdateCouncilLecturer(council, lecturer3, "Ủy viên");
                    addOrUpdateCouncilLecturer(council, lecturer4, "Ủy viên");
                    addOrUpdateCouncilLecturer(council, lecturer5, "Ủy viên");
                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);
                    sendEmailToCouncilLecturers(council);
                    return new ResponseEntity<>(council,HttpStatus.CREATED);
                }else{
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    public ResponseEntity<?> updateCouncilEssay(int id,String authorizationHeader, String date,String timeStart, String timeEnd, String addressReport,
                                           String lecturer1, String lecturer2){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject!=null){
                List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(subject.getTypeSubject(),true);
                if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                    return new ResponseEntity<>("Không nằm trong khoảng thời gian hội đồng được tổ chức.", HttpStatus.BAD_GATEWAY);
                }
                if (subject.getCouncil()!=null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);
                    // Kiểm tra xem có Council khác có cùng timeStart và timeEnd không
                    TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
                    //Tìm các đề tài của TLCN
                    List<Subject> subjects = subjectRepository.findSubjectByType(typeSubject);
                    //Lấy danh sách council của các subject này ra
                    List<Council> conflictCouncil = new ArrayList<>();
                    for (Subject s:subjects) {
                        //Kiểm tra các subject có council  và có time đã được set
                        if (s.getCouncil()!=null) {
                            if (s.getCouncil().getStart()!=null && s.getCouncil().getEnd()!=null) {
                                conflictCouncil.add(s.getCouncil());
                            }
                        }
                    }
                    council.setStart(convertToTime(timeStart));
                    council.setEnd(convertToTime(timeEnd));
                    council.setDate(convertStringToLocalDate(date));
                    if (hasTimeConflict(council,conflictCouncil)) {
                        return new ResponseEntity<>("Đã tồn tại hội đồng nằm trong khoản tời gian này.", HttpStatus.CONFLICT);
                    }
                    // Xóa CouncilLecturer cũ của giảng viên nếu có sự thay đổi
                    removeCouncilLecturerIfNeeded(council, lecturer1);
                    removeCouncilLecturerIfNeeded(council, lecturer2);
                    // Thêm giảng viên mới vào CouncilLecturer nếu có sự thay đổi
                    addOrUpdateCouncilLecturer(council, lecturer1, "Chủ tịch");
                    addOrUpdateCouncilLecturer(council, lecturer2, "Ủy viên");
                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);
                    sendEmailToCouncilLecturers(council);
                    return new ResponseEntity<>(council,HttpStatus.CREATED);
                }else{
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    // Phương thức xóa CouncilLecturer của giảng viên cũ
    private void removeCouncilLecturerIfNeeded(Council council, String lecturerId) {
        if (lecturerId != null) {
            CouncilLecturer councilLecturerToRemove = null;
            //tìm ra councillecturer của council và lecturer này
            for (CouncilLecturer cl : council.getCouncilLecturers()) {
                if (cl.getLecturer().getLecturerId().equals(lecturerId)) {
                    councilLecturerToRemove = cl;
                    break;
                }
            }
            if (councilLecturerToRemove != null) {
                council.getCouncilLecturers().remove(councilLecturerToRemove);
                Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);
                if (lecturer!=null){
                    lecturer.getCouncilLecturers().remove(councilLecturerToRemove);
                }
                councilLecturerRepository.delete(councilLecturerToRemove); // Gán councilLecturer này về null để ngăn không cho nó bị xóa khỏi cơ sở dữ liệu
                councilRepository.save(council); // Lưu lại council sau khi xóa councilLecturer
            }
        }
    }

    // Phương thức thêm hoặc cập nhật CouncilLecturer cho giảng viên mới
    private void addOrUpdateCouncilLecturer(Council council, String lecturerId, String role) {
        if (lecturerId != null) {
            Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);
            if (lecturer != null) {
                CouncilLecturer councilLecturer = council.getCouncilLecturers().stream()
                        .filter(cl -> cl.getLecturer().equals(lecturer))
                        .findFirst()
                        .orElse(null);

                if (councilLecturer == null) {
                    councilLecturer = new CouncilLecturer();
                    councilLecturer.setCouncil(council);
                    councilLecturer.setLecturer(lecturer);
                    councilLecturer.setRole(role);
                    council.getCouncilLecturers().add(councilLecturer);
                    lecturer.getCouncilLecturers().add(councilLecturer);
                    lecturerRepository.save(lecturer);
                } else {
                    councilLecturer.setRole(role);
                    councilRepository.save(council);
                }
            }
        }
    }

    private void sendEmailToCouncilLecturers(Council council) {
        List<String> emailList = council.getCouncilLecturers().stream()
                .map(cl -> cl.getLecturer().getPerson().getUsername())
                .collect(Collectors.toList());
        Subject subject = subjectRepository.findSubjectByCouncil(council);
        if (subject.getStudent1()!=null){
            Student student = studentRepository.findById(subject.getStudent1()).orElse(null);
            emailList.add(student.getPerson().getUsername());
        }
        if (subject.getStudent2()!=null){
            Student student = studentRepository.findById(subject.getStudent2()).orElse(null);
            emailList.add(student.getPerson().getUsername());
        }
        if (subject.getStudent3()!=null){
            Student student = studentRepository.findById(subject.getStudent3()).orElse(null);
            emailList.add(student.getPerson().getUsername());
        }
        String subjectMail = "CẬP NHẬT THỜI GIAN BÁO CÁO CỦA HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + council.getSubject().getSubjectName();
        String message = "Đã cập nhật hội đồng phản biện đề tài: " + council.getSubject().getSubjectName() + "\n"
                +"Vào lúc: " + council.getStart() + "-" + council.getEnd() + "ngày " + council.getDate();
        mailService.sendMailToPerson(emailList, subjectMail, message);
    }

    public ResponseEntity<?> getTest(String a){
        String token = tokenUtils.extractToken(a);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
        return new ResponseEntity<>(existedLecturer,HttpStatus.OK);
    }

}
