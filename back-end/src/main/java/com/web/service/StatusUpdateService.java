package com.web.service;

import com.web.entity.CouncilLecturer;
import com.web.entity.ScoreEssay;
import com.web.entity.Subject;
import com.web.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StatusUpdateService {
    @Autowired
    private TimeBrowseHeadRepository timeBrowsOfHeadRepository;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private ScoreEssayRepository scoreEssayRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;


    @Transactional
    @Scheduled(fixedRate = 60000) // Chạy mỗi phút (60.000 milliseconds)
    public void updateExpiredStatuses() {
        LocalDateTime currentDate = LocalDateTime.now();
        timeBrowsOfHeadRepository.updateStatusOfPreviousRegistrations(currentDate);
        registrationPeriodRepository.updateStatusOfStudent(currentDate);
        registrationPeriodLecturerRepository.updateStatusOfLecturer(currentDate);
    }

/*    @Transactional
    @Scheduled(fixedRate = 1000) // Chạy mỗi giây (1000 milliseconds)
    public void updateSubjectActiveStatuses() {
        List<Subject> subjectsWithActive8 = subjectRepository.findSubjectByActive((byte)8); // Lấy các Subject có active = 8

        // Nếu không có subject nào với active = 8, không làm gì cả
        if (subjectsWithActive8.isEmpty()) {
            return;
        }
        for (Subject subject : subjectsWithActive8) {
            updateSubjectActiveStatus(subject);
        }
    }

    private void updateSubjectActiveStatus(Subject subject) {
        // Lấy danh sách giảng viên trong hội đồng
        List<CouncilLecturer> councilLecturerByCouncil = councilLecturerRepository.getListCouncilLecturerByCouncil(subject.getCouncil());
        int countLecturers = councilLecturerByCouncil.size();

        // Lấy danh sách score của sinh viên cho đề tài đó
        List<ScoreEssay> studentScoreEssay = ScoreEssayRepository.getScoresBySubject(subject);
        int countScores = studentScores.size();

        // Kiểm tra và cập nhật trường active của subject
        if (countScores == countLecturers) {
            subject.setActive((byte)9);
            subjectRepository.save(subject);  // Giả sử bạn có một repository để lưu đối tượng Subject
        }
    }*/



}
