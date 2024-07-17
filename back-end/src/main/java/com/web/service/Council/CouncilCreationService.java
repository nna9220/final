package com.web.service.Council;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class CouncilCreationService {
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private CouncilReportTimeRepository councilReportTimeRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private SubjectRepository subjectRepository;

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

    public ResponseEntity<?> getTest(String a){
        String token = tokenUtils.extractToken(a);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
        return new ResponseEntity<>(existedLecturer,HttpStatus.OK);
    }




    @Transactional
    public ResponseEntity<?> createCouncils(String date, String address, String authen) {
        String token = tokenUtils.extractToken(authen);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
        if (existedLecturer == null) {
            return new ResponseEntity<>("Giảng viên không tồn tại", HttpStatus.NOT_FOUND);
        }

        // Phân hội đồng theo chuyên ngành
        List<Lecturer> lecturers = lecturerRepository.getListLecturerByMajor(existedLecturer.getMajor());
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        List<Subject> subjects = subjectRepository.findSubjectByTypeSubject(typeSubject, existedLecturer.getMajor(), (byte) 8);

        // Mỗi ngày bắt đầu từ 7h đến 11h và 13h đến 17h
        LocalTime morningStartTime = LocalTime.of(7, 0);
        LocalTime morningEndTime = LocalTime.of(11, 0);
        LocalTime afternoonStartTime = LocalTime.of(13, 0);
        LocalTime afternoonEndTime = LocalTime.of(17, 0);

        // Ngày hiện tại để bắt đầu phân công
        LocalDate currentDate = convertStringToLocalDate(date);

        // Shuffle danh sách giảng viên để phân bố ngẫu nhiên
        Collections.shuffle(lecturers);

        int lecturerIndex = 0;
        LocalTime currentStartTime = morningStartTime;
        LocalTime currentEndTime = currentStartTime.plusHours(1);

        for (Subject subject : subjects) {
            List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(subject.getTypeSubject(), true);

            if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                return new ResponseEntity<>("Không nằm trong khoảng thời gian tạo hội đồng", HttpStatus.BAD_GATEWAY);
            }

            // Kiểm tra xem đề tài đã có hội đồng chưa
            Council existingCouncil = councilRepository.getCouncilBySubject(subject);

            System.out.println("Existed council: " + existingCouncil);
            if (existingCouncil != null) {
                System.out.println("Nhảy vào đây");
                // Nếu đã có hội đồng, xóa hội đồng cũ và các council lecturer liên quan
                List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(existingCouncil);
                System.out.println("Council Lecturers to delete: " + councilLecturers);
                for (CouncilLecturer cl:councilLecturers) {
                    cl.setCouncil(null);
                    cl.setLecturer(null);
                }
                councilLecturerRepository.saveAll(councilLecturers);
                // Remove the council
                Subject subjectFind = subjectRepository.findSubjectByCouncil(existingCouncil);
                subject.setCouncil(null);
                subjectRepository.save(subjectFind);
                existingCouncil.setCouncilLecturers(null);
                existingCouncil.setDate(null);
                existingCouncil.setEnd(null);
                existingCouncil.setStart(null);
                existingCouncil.setAddress(null);
                existingCouncil.setSubject(null);
                councilRepository.save(existingCouncil);
            }
            Council existingCouncilCheck = councilRepository.getCouncilBySubject(subject);
            if (existingCouncilCheck!=null) {
                System.out.println("council xóa: " + existingCouncilCheck);
            }
            System.out.println("Đã xóa");
            // Tạo hội đồng mới trong khung thời gian hiện tại
            createCouncilForTimeFrame(currentDate, currentStartTime, currentEndTime, address, subject, lecturers, 3, lecturerIndex);
            System.out.println("Thời gian bắt đầu: " + currentStartTime + " " + currentEndTime);
            // Cập nhật thời gian cho hội đồng tiếp theo
            currentStartTime = currentEndTime;
            currentEndTime = currentStartTime.plusHours(1);

            // Nếu thời gian kết thúc vượt quá thời gian buổi sáng hoặc chiều thì chuyển sang buổi tiếp theo hoặc ngày tiếp theo
            if (currentEndTime.isAfter(morningEndTime) && currentStartTime.isBefore(afternoonStartTime)) {
                currentStartTime = afternoonStartTime;
                currentEndTime = currentStartTime.plusHours(1);
            }

            if (currentEndTime.isAfter(afternoonEndTime)) {
                currentDate = currentDate.plusDays(1);
                currentStartTime = morningStartTime;
                currentEndTime = currentStartTime.plusHours(1);
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void deleteCouncil(Council council) {
        // Remove associated council lecturers
        List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(council);
        councilLecturerRepository.deleteAll(councilLecturers);
        // Remove the council
        Subject subject = subjectRepository.findSubjectByCouncil(council);
        subject.setCouncil(null);
        subjectRepository.save(subject);
        councilRepository.delete(council);
    }

    private void createCouncilForTimeFrame(LocalDate date, LocalTime startTime, LocalTime endTime, String address,
                                           Subject subject, List<Lecturer> lecturers, int numLecturers, int lecturerIndex) {
        // Tạo hội đồng mới
        Council council = new Council();
        council.setSubject(subject);
        subject.setCouncil(council);
        council.setAddress(address);
        council.setDate(date);
        council.setStart(startTime);
        council.setEnd(endTime);
        List<String> listStudent = new ArrayList<>();
        List<Lecturer> lecturerList = new ArrayList<>();
        for (Lecturer lecturer:lecturers) {
            if (lecturer!=subject.getInstructorId()){
                lecturerList.add(lecturer);
            }
        }

        // Tạo danh sách giảng viên tạm thời
        List<CouncilLecturer> councilLecturers = new ArrayList<>();
        List<Lecturer> shuffledLecturers = new ArrayList<>(lecturerList);
        Collections.shuffle(shuffledLecturers);

        // Phân bổ giảng viên cho hội đồng
        for (int i = 0; i < numLecturers; i++) {
            if (lecturerIndex >= shuffledLecturers.size()) {
                // Nếu hết giảng viên, shuffle lại danh sách
                Collections.shuffle(shuffledLecturers);
                lecturerIndex = 0;
            }
            Lecturer lecturer = shuffledLecturers.get(lecturerIndex++);
            CouncilLecturer councilLecturer = new CouncilLecturer();
            councilLecturer.setCouncil(council);
            councilLecturer.setLecturer(lecturer);
            // Thiết lập vai trò
            councilLecturer.setRole(i == 0 ? "Chủ tịch" : "Ủy viên");
            councilLecturers.add(councilLecturer);
            listStudent.add(lecturer.getPerson().getUsername());
        }

        // Thêm sinh viên vào danh sách
        addStudentToList(subject.getStudent1(), listStudent);
        addStudentToList(subject.getStudent2(), listStudent);
        addStudentToList(subject.getStudent3(), listStudent);

        councilLecturerRepository.saveAll(councilLecturers);

        council.setCouncilLecturers(councilLecturers);
        councilRepository.save(council);

        String subjectStudent = "THÔNG BÁO THÀNH LẬP HỘI ĐỒNG CHO ĐỀ TÀI " + subject.getSubjectName();
        String messengerStudent = "Topic: " + subject.getSubjectName() + " đã được thành lập hội đồng. Chi tiết vui lòng truy cập website." + "\n"
                + "Thời gian: " + startTime + "-" + endTime + "Ngày " + date;
        mailService.sendMailToPerson(listStudent, subjectStudent, messengerStudent);
    }

    private void addStudentToList(String studentId, List<String> listStudent) {
        if (studentId != null) {
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student != null) {
                listStudent.add(student.getPerson().getUsername());
            }
        }
    }


}

