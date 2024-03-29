package com.web.service;

import com.web.config.CheckRole;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.utils.UserUtils;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private LecturerRepository lecturerRepository;


    public void generateExcel(HttpServletResponse response, HttpSession session) throws IOException {
        Person current = CheckRole.getRoleCurrent(session,userUtils,personRepository);
        Lecturer lec = lecturerRepository.findById(current.getPersonId()).orElse(null);
        List<Subject> subjects  = subjectRepository.getSubjectByMajor(lec.getMajor());
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Subject");
        HSSFRow row = sheet.createRow(0);
        row.createCell(0).setCellValue("subjectId");
        row.createCell(1).setCellValue("subjectName");
        row.createCell(2).setCellValue("major");
        row.createCell(3).setCellValue("student1");
        row.createCell(4).setCellValue("student2");
        row.createCell(5).setCellValue("instructorId");
        row.createCell(6).setCellValue("thesisAdvisorId");
        row.createCell(7).setCellValue("requirement");
        row.createCell(8).setCellValue("expected");
        row.createCell(9).setCellValue("review");
        row.createCell(10).setCellValue("score");

        int dataRowIndex= 1;
        for (Subject subject:subjects){
            HSSFRow dataRow =  sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(subject.getSubjectId());
            dataRow.createCell(1).setCellValue(subject.getSubjectName());
            dataRow.createCell(2).setCellValue(subject.getMajor().name());
            dataRow.createCell(3).setCellValue(subject.getStudent1());
            dataRow.createCell(4).setCellValue(subject.getStudent2());
            dataRow.createCell(5).setCellValue(subject.getInstructorId().getLecturerId());
            dataRowIndex++;
        }
        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();;
        ops.close();
    }

}
