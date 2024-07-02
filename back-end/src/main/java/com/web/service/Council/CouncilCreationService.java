package com.web.service.Council;

import com.web.config.CompareTime;
import com.web.entity.*;
import com.web.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CouncilCreationService {
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private CouncilReportTimeRepository councilReportTimeRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private SubjectRepository subjectRepository;

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

    @Transactional // Đảm bảo toàn bộ phương thức được thực thi trong một giao dịch
    public ResponseEntity<?> createCouncils(String date, String address, Lecturer lecturer) {
        // Phân hội đồng theo chuyên ngành
        List<Lecturer> lecturers = lecturerRepository.getListLecturerByMajor(lecturer.getMajor());
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        List<Subject> subjects = subjectRepository.findSubjectByTypeSubject(typeSubject);

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
            List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(subject.getTypeSubject(),true);

            if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                return new ResponseEntity<>("Không nằm trong khoảng thời gian tạo hội đồng", HttpStatus.BAD_GATEWAY);
            }
            // Kiểm tra xem đề tài đã có hội đồng chưa
            Council existingCouncil = councilRepository.getCouncilBySubject(subject);

            if (existingCouncil != null) {
                // Nếu đã có hội đồng, xóa hội đồng cũ và các council lecturer liên quan
                deleteCouncil(existingCouncil);
            }

            int numLecturers = 5;

            // Tạo hội đồng mới trong khung thời gian hiện tại
            createCouncilForTimeFrame(currentDate, currentStartTime, currentEndTime, address, subject, lecturers, numLecturers, lecturerIndex);

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

    private void createCouncilForTimeFrame(LocalDate date, LocalTime startTime, LocalTime endTime, String address,
                                           Subject subject, List<Lecturer> lecturers, int numLecturers, int lecturerIndex) {
        // Tạo hội đồng mới
        Council council = new Council();
        council.setSubject(subject);
        council.setAddress(address);
        council.setDate(date);
        council.setStart(startTime);
        council.setEnd(endTime);

        // Phân bổ giảng viên cho hội đồng
        List<CouncilLecturer> councilLecturers = new ArrayList<>();
        for (int i = 0; i < numLecturers; i++) { // Mỗi hội đồng có 5 giảng viên dựa trên typesubject
            if (lecturerIndex >= lecturers.size()) {
                // Nếu hết giảng viên, shuffle lại danh sách
                Collections.shuffle(lecturers);
                lecturerIndex = 0;
            }
            Lecturer lecturer = lecturers.get(lecturerIndex++);
            CouncilLecturer councilLecturer = new CouncilLecturer();
            councilLecturer.setCouncil(council);
            councilLecturer.setLecturer(lecturer);
            councilLecturers.add(councilLecturer);
        }


        council.setCouncilLecturers(councilLecturers);
        councilRepository.save(council);
        councilLecturerRepository.saveAll(councilLecturers);
    }

    private void deleteCouncil(Council council) {
        // Xóa tất cả council lecturers của hội đồng
        List<CouncilLecturer> councilLecturers = council.getCouncilLecturers();
        councilLecturerRepository.deleteAll(councilLecturers);
        // Xóa hội đồng
        councilRepository.delete(council);
    }
}

