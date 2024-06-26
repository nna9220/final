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
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
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
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
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

    public boolean hasTimeConflict(Council council,LocalDate date,LocalTime start,LocalTime end, List<Council> conflictCouncils) {

        for (Council otherCouncil : conflictCouncils) {
            if (council!=otherCouncil) {
                LocalDate date2 = otherCouncil.getDate();
                LocalTime start2 = otherCouncil.getStart();
                LocalTime end2 = otherCouncil.getEnd();

                // Kiểm tra xem có sự chồng chéo giữa khoảng thời gian start1-end1 và start2-end2
                if (date.equals(date2) && start.isBefore(end2) && start2.isBefore(end)) {
                    return true; // Có xung đột
                }
            }
        }

        return false; // Không có xung đột
    }

    public static LocalDate convertStringToLocalDate(String dateString) {
        String pattern = "yyyy-MM-dd";
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
            System.out.println("Date nhận: " + date);
            System.out.println("start nhận: " + timeStart);
            System.out.println("end nhận: " + timeEnd);
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
                    if (hasTimeConflict(council,convertStringToLocalDate(date),convertToTime(timeStart),convertToTime(timeEnd),conflictCouncil)) {
                        return new ResponseEntity<>("Đã tồn tại hội đồng nằm trong khoản tời gian này.", HttpStatus.CONFLICT);
                    }
                    council.setStart(convertToTime(timeStart));
                    council.setEnd(convertToTime(timeEnd));
                    council.setDate(convertStringToLocalDate(date));

                    // Thêm giảng viên mới vào CouncilLecturer nếu có sự thay đổi
                    updateCouncilLecturerIfNeeded(council, lecturer1, "Chủ tịch");
                    updateCouncilLecturerIfNeeded(council, lecturer2, "Ủy viên");
                    updateCouncilLecturerIfNeeded(council, lecturer3, "Ủy viên");
                    updateCouncilLecturerIfNeeded(council, lecturer4, "Ủy viên");
                    updateCouncilLecturerIfNeeded(council, lecturer5, "Ủy viên");
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
                Council council = subject.getCouncil();

                if (council == null) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                council.setAddress(addressReport);
                council.setStart(convertToTime(timeStart));
                council.setEnd(convertToTime(timeEnd));
                council.setDate(convertStringToLocalDate(date));

                // Xóa CouncilLecturer cũ của giảng viên nếu có sự thay đổi
                // Thêm giảng viên mới vào CouncilLecturer nếu có sự thay đổi
                updateCouncilLecturerIfNeeded(council, lecturer1, "Chủ tịch");
                updateCouncilLecturerIfNeeded(council, lecturer2, "Ủy viên");

                councilRepository.save(council);
                subject.setCouncil(council);
                subjectRepository.save(subject);

                sendEmailToCouncilLecturers(council);

                return new ResponseEntity<>(council, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    // Phương thức xóa CouncilLecturer của giảng viên cũ
    // Phương thức xóa CouncilLecturer của giảng viên cũ
    // Phương thức cập nhật hoặc thêm mới CouncilLecturer nếu cần thiết
    private void updateCouncilLecturerIfNeeded(Council council, String newLecturerId, String role) {
        if (newLecturerId != null) {
            Lecturer newLecturer = lecturerRepository.findById(newLecturerId).orElse(null);
            if (newLecturer != null) {
                CouncilLecturer existingCouncilLecturer = council.getCouncilLecturers().stream()
                        .filter(cl -> cl.getRole().equals(role))
                        .findFirst()
                        .orElse(null);

                if (existingCouncilLecturer != null) {
                    // Nếu giảng viên mới khác với giảng viên cũ
                    if (!existingCouncilLecturer.getLecturer().getLecturerId().equals(newLecturerId)) {
                        // Xóa giảng viên cũ
                        council.getCouncilLecturers().remove(existingCouncilLecturer);
                        Lecturer oldLecturer = lecturerRepository.findById(existingCouncilLecturer.getLecturer().getLecturerId()).orElse(null);
                        if (oldLecturer != null) {
                            oldLecturer.getCouncilLecturers().remove(existingCouncilLecturer);
                            lecturerRepository.save(oldLecturer);
                        }
                        councilLecturerRepository.delete(existingCouncilLecturer);
                        // Thêm giảng viên mới
                        addCouncilLecturer(council, newLecturer, role);
                    }
                } else {
                    // Thêm giảng viên mới nếu chưa tồn tại giảng viên cũ
                    addCouncilLecturer(council, newLecturer, role);
                }
            }
        }
    }

    // Phương thức thêm mới CouncilLecturer
    private void addCouncilLecturer(Council council, Lecturer lecturer, String role) {
        CouncilLecturer newCouncilLecturer = new CouncilLecturer();
        newCouncilLecturer.setCouncil(council);
        newCouncilLecturer.setLecturer(lecturer);
        newCouncilLecturer.setRole(role);
        council.getCouncilLecturers().add(newCouncilLecturer);
        lecturer.getCouncilLecturers().add(newCouncilLecturer);
        councilLecturerRepository.save(newCouncilLecturer);
        lecturerRepository.save(lecturer);
        councilRepository.save(council);
    }

    private void sendEmailToCouncilLecturers(Council council) {
        List<String> emailList = council.getCouncilLecturers().stream()
                .map(cl -> cl.getLecturer().getPerson().getUsername())
                .collect(Collectors.toList());
        String subjectMail = "CẬP NHẬT HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + council.getSubject().getSubjectName();
        String message = "Đã cập nhật hội đồng phản biện đề tài: " + council.getSubject().getSubjectName();
        mailService.sendMailToPerson(emailList, subjectMail, message);
    }

}
