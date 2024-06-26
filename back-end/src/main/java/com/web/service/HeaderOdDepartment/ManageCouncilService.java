package com.web.service.HeaderOdDepartment;

import com.web.config.CheckRole;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ManageCouncilService {
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
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
            Lecturer lecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> subjects = subjectRepository.findSubjectByActiveAndStatusAndMajorAndType((byte)1,lecturer.getMajor(),typeSubject);
            return new ResponseEntity<>(subjects,HttpStatus.OK);
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
                    council.setTimeReport(convertToLocalDateTime(timeReport));
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
                    if (hasTimeConflict(council,conflictCouncil)) {
                        return new ResponseEntity<>("Đã tồn tại hội đồng nằm trong khoản tời gian này.", HttpStatus.CONFLICT);
                    }
                    council.setStart(convertToTime(timeStart));
                    council.setEnd(convertToTime(timeEnd));
                    council.setDate(convertStringToLocalDate(date));
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


    public ResponseEntity<?> updateCouncilEssay(int id, String authorizationHeader, String date, String timeStart, String timeEnd, String addressReport,
                                                String lecturer1, String lecturer2) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject != null) {
                if (subject.getCouncil() != null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);

                    // Kiểm tra xem có Council khác có cùng timeStart và timeEnd không
                    TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
                    // Tìm các đề tài của TLCN
                    List<Subject> subjects = subjectRepository.findSubjectByType(typeSubject);
                    // Lấy danh sách council của các subject này ra
                    List<Council> conflictCouncil = new ArrayList<>();
                    for (Subject s : subjects) {
                        // Kiểm tra các subject có council  và có time đã được set
                        if (s.getCouncil() != null) {
                            if (s.getCouncil().getStart() != null && s.getCouncil().getEnd() != null) {
                                conflictCouncil.add(s.getCouncil());
                            }
                        }
                    }

                    if (hasTimeConflict(council, conflictCouncil)) {
                        return new ResponseEntity<>("Đã tồn tại hội đồng nằm trong khoản thời gian này.", HttpStatus.CONFLICT);
                    }

                    council.setStart(convertToTime(timeStart));
                    council.setEnd(convertToTime(timeEnd));
                    council.setDate(convertStringToLocalDate(date));

                    // Xóa CouncilLecturer cũ của giảng viên nếu có sự thay đổi
                    removeCouncilLecturerIfNeeded(council, lecturer1);
                    removeCouncilLecturerIfNeeded(council, lecturer2);

                    // Thêm hoặc cập nhật CouncilLecturer cho giảng viên mới
                    addOrUpdateCouncilLecturer(council, lecturer1, "Chủ tịch");
                    addOrUpdateCouncilLecturer(council, lecturer2, "Ủy viên");

                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);

                    sendEmailToCouncilLecturers(council);

                    return new ResponseEntity<>(council, HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    // Phương thức xóa CouncilLecturer của giảng viên cũ
    private void removeCouncilLecturerIfNeeded(Council council, String lecturerId) {
        if (lecturerId != null) {
            CouncilLecturer councilLecturerToRemove = council.getCouncilLecturers().stream()
                    .filter(cl -> cl.getLecturer().getLecturerId().equals(lecturerId))
                    .findFirst()
                    .orElse(null);
            if (councilLecturerToRemove != null) {
                council.getCouncilLecturers().remove(councilLecturerToRemove);
                Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);
                if (lecturer != null) {
                    lecturer.getCouncilLecturers().remove(councilLecturerToRemove);
                    lecturerRepository.save(lecturer);
                }
                councilRepository.save(council);
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
                }
                councilRepository.save(council);
            }
        }
    }


    private void sendEmailToCouncilLecturers(Council council) {
        List<String> emailList = council.getCouncilLecturers().stream()
                .map(cl -> cl.getLecturer().getPerson().getUsername())
                .collect(Collectors.toList());
        String subjectMail = "CẬP NHẬT HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + council.getSubject().getSubjectName();
        String message = "Đã cập nhật hội đồng phản biện đề tài: " + council.getSubject().getSubjectName();
        mailService.sendMailToPerson(emailList, subjectMail, message);
    }


    public ResponseEntity<Map<String,Object>> getDetailSubject(int subjectId){
        Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
        if (existedSubject!=null){
            Council existedCouncil = councilRepository.getCouncilBySubject(existedSubject);
            if (existedCouncil!=null){
                List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(existedCouncil);
                Map<String,Object> response = new HashMap<>();
                response.put("subject",existedSubject);
                List<Lecturer> lecturers = new ArrayList<>();
                for (CouncilLecturer c:councilLecturers) {
                    lecturers.add(c.getLecturer());
                }
                response.put("council",existedCouncil);
                response.put("councilLecturer",councilLecturers);
                response.put("listLecturerOfCouncil", lecturers);
                return new ResponseEntity<>(response,HttpStatus.OK);
            }else {
                //mã 417
                return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
