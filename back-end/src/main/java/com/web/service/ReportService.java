package com.web.service;

import com.web.config.CheckRole;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ReportService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ScoreEssayRepository scoreEssayRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;


    public void generateExcel(HttpServletResponse response, HttpSession session, TypeSubject typeSubject) throws IOException {
        Person current = CheckRole.getRoleCurrent(session,userUtils,personRepository);
        Lecturer lec = lecturerRepository.findById(current.getPersonId()).orElse(null);
        List<Subject> subjects  = subjectRepository.getSubjectByMajor(lec.getMajor(),typeSubject,(byte)9);
        List<Subject> filteredSubjects = new ArrayList<>();
        for (Subject subject : subjects) {
            // Kiểm tra xem có sinh viên nào trong đề tài này có trạng thái true không
            boolean hasActiveStudent = false;
            Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
            if (student1.getStatus() == true) {
                hasActiveStudent = true;
            }
            // Nếu có sinh viên với trạng thái true, thêm đề tài này vào danh sách đã lọc
            if (hasActiveStudent) {
                filteredSubjects.add(subject);
            }
        }
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet(typeSubject.getTypeName());
        HSSFRow row = sheet.createRow(0);
        row.createCell(0).setCellValue("MÃ ĐỀ TÀI");
        row.createCell(1).setCellValue("TÊN ĐỀ TÀI");
        row.createCell(2).setCellValue("CHUYÊN NGÀNH");
        row.createCell(3).setCellValue("MÃ SINH VIÊN 1");
        row.createCell(4).setCellValue("TÊN SVTH 1");
        row.createCell(5).setCellValue("MÃ SINH VIÊN 2");
        row.createCell(6).setCellValue("TÊN SVTH 2");
        row.createCell(7).setCellValue("MÃ SINH VIÊN 3");
        row.createCell(8).setCellValue("TÊN SVTH 3");
        row.createCell(9).setCellValue("MÃ GIẢNG VIÊN HƯỚNG DẪN");
        row.createCell(10).setCellValue("TÊN GIẢNG VIÊN HƯỚNG DẪN");
        row.createCell(11).setCellValue("MÃ GIẢNG VIÊN PHẢN BIỆN");
        row.createCell(12).setCellValue("TÊN GIẢNG VIÊN PHẢN BIỆN");
        row.createCell(13).setCellValue("YÊU CẦU");
        row.createCell(14).setCellValue("MONG MUỐN");
        row.createCell(15).setCellValue("ĐIỂM SV1");
        row.createCell(16).setCellValue("ĐIỂM SV2");
        row.createCell(17).setCellValue("ĐIỂM SV3");
        double score1 = 0;
        double score2 = 0;
        double score3 = 0;
        int dataRowIndex= 1;

        for (Subject subject:filteredSubjects){
            Lecturer instructor = lecturerRepository.findById(subject.getInstructorId().getLecturerId()).orElse(null);
            Lecturer thesis = lecturerRepository.findById(subject.getInstructorId().getLecturerId()).orElse(null);
            ReviewByThesis reviewByThesis = reviewByThesisRepository.getReviewByThesisBySAndSubject(subject);
            ReviewByInstructor reviewByInstructor = reviewByInstructorRepository.getReviewByInstructorBySAndSubject(subject);
            HSSFRow dataRow =  sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(subject.getSubjectId());
            dataRow.createCell(1).setCellValue(subject.getSubjectName());
            dataRow.createCell(2).setCellValue(subject.getMajor().name());
            dataRow.createCell(9).setCellValue(subject.getInstructorId().getLecturerId());
            dataRow.createCell(10).setCellValue(instructor.getPerson().getFirstName() + " " + instructor.getPerson().getLastName());
            dataRow.createCell(11).setCellValue(subject.getThesisAdvisorId().getLecturerId());
            dataRow.createCell(12).setCellValue(thesis.getPerson().getFirstName() + " " + instructor.getPerson().getLastName());
            dataRow.createCell(13).setCellValue(subject.getRequirement());
            dataRow.createCell(14).setCellValue(subject.getExpected());
            dataRowIndex++;
            if (subject.getStudent1()!=null) {
                Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")){
                    ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student1,subject);
                    List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                    int countLecturer = scoreEssays.size();
                    for (ScoreEssay s:scoreEssays) {
                        score1 = score1+s.getScore();
                    }
                    score1 = score1/countLecturer;
                }else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")){
                    ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student1,subject);
                    List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                    int countLecturer = scoreGraduations.size();
                    double scoreCouncil = 0;
                    for (ScoreGraduation s:scoreGraduations) {
                        scoreCouncil = scoreCouncil+s.getScore();
                    }
                    scoreCouncil = scoreCouncil/countLecturer;
                    score1 = (scoreCouncil+reviewByInstructor.getScore() + reviewByThesis.getScore())/3;
                }
                dataRow.createCell(3).setCellValue(subject.getStudent1());
                dataRow.createCell(4).setCellValue(student1.getPerson().getFirstName() + " " + student1.getPerson().getLastName());

                dataRow.createCell(15).setCellValue(score1);
            }
            if (subject.getStudent2()!=null) {
                Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")){
                    ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student2,subject);
                    List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                    int countLecturer = scoreEssays.size();
                    for (ScoreEssay s:scoreEssays) {
                        score2 = score2+s.getScore();
                    }
                    score2 = score2/countLecturer;
                }else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")){
                    ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student2,subject);
                    List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                    int countLecturer = scoreGraduations.size();
                    double scoreCouncil = 0;
                    for (ScoreGraduation s:scoreGraduations) {
                        scoreCouncil = scoreCouncil+s.getScore();
                    }
                    scoreCouncil = scoreCouncil/countLecturer;
                    score2 = (scoreCouncil+reviewByInstructor.getScore() + reviewByThesis.getScore())/3;
                }
                dataRow.createCell(5).setCellValue(subject.getStudent1());
                dataRow.createCell(6).setCellValue(student2.getPerson().getFirstName() + " " + student2.getPerson().getLastName());
                dataRow.createCell(16).setCellValue(score2);
            }

            if (subject.getStudent3()!=null) {
                Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")){
                    ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student3,subject);
                    List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                    int countLecturer = scoreEssays.size();
                    for (ScoreEssay s:scoreEssays) {
                        score3 = score3+s.getScore();
                    }
                    score3 = score3/countLecturer;
                }else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")){
                    ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student3,subject);
                    List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                    int countLecturer = scoreGraduations.size();
                    double scoreCouncil = 0;
                    for (ScoreGraduation s:scoreGraduations) {
                        scoreCouncil = scoreCouncil+s.getScore();
                    }
                    scoreCouncil = scoreCouncil/countLecturer;
                    score3 = (scoreCouncil+reviewByInstructor.getScore() + reviewByThesis.getScore())/3;
                }
                dataRow.createCell(7).setCellValue(subject.getStudent1());
                dataRow.createCell(8).setCellValue(student3.getPerson().getFirstName() + " " + student3.getPerson().getLastName());
                dataRow.createCell(17).setCellValue(score3);
            }

        }
        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();;
        ops.close();
    }

}
