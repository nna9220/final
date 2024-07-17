package com.web.service.HeaderOdDepartment;

import com.web.entity.*;
import com.web.repository.*;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class WordExportService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;

    public byte[] exportWordFile(Major major, TypeSubject typeSubject) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/Mau-2-Rubric-KLTN-Edit.docx");
        XWPFDocument document = new XWPFDocument(inputStream);
        LocalDate nowDate = LocalDate.now();

        // Lấy tiêu chí theo loại đề tài, năm và chuyên ngành
        List<EvaluationCriteria> criteriaList = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndMajorAndYear(typeSubject, major, String.valueOf(nowDate.getYear()));

        // Điền dữ liệu bộ môn
        appendTextAfterKeyword(document, "Bộ Môn :", String.valueOf(major));

        // Điền tiêu chí và thang điểm
        XWPFTable table = document.getTables().get(1); // Lấy bảng thứ hai
        // Xóa nội dung các ô trong cột STT, Tiêu chí và Điểm
        for (int i = 1; i < table.getNumberOfRows(); i++) {
            XWPFTableRow row = table.getRow(i);
            row.getCell(0).removeParagraph(0); // Ô STT
            row.getCell(1).removeParagraph(0); // Ô Tiêu chí
            row.getCell(2).removeParagraph(0); // Ô Điểm
        }

        // Điền lại tiêu chí và thang điểm
        for (int i = 0; i < criteriaList.size(); i++) {
            EvaluationCriteria criteria = criteriaList.get(i);
            XWPFTableRow row = (i < table.getNumberOfRows() - 1) ? table.getRow(i + 1) : table.createRow();
            row.getCell(0).setText(String.valueOf(i + 1));
            row.getCell(1).setText(criteria.getCriteriaName());
            row.getCell(2).setText(criteria.getCriteriaScore().toString());
        }

        // Lưu tài liệu vào ByteArrayOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        document.write(byteArrayOutputStream);
        byteArrayOutputStream.close();
        inputStream.close();

        // Trả về nội dung của tài liệu dưới dạng byte array
        return byteArrayOutputStream.toByteArray();
    }

    public void exportReviewByInstructorFile(String outputPath, int subjectId) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/NhanXetGVHD.docx");
        if (inputStream == null) {
            throw new FileNotFoundException("Template file not found");
        }

        File outputFile = new File(outputPath);
        try (XWPFDocument document = new XWPFDocument(inputStream)) {

            // Lấy dữ liệu từ cơ sở dữ liệu
            Subject subject = subjectRepository.findById(subjectId).orElse(null);
            if (subject != null) {
                // Tìm kết quả theo đề tài
                if (subject.getStudent1() != null) {
                    Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                    if (student1 != null) {
                        replaceTextInDocument(document, "Nguyễn Thị Na", student1.getPerson().getFirstName() + " " + student1.getPerson().getLastName());
                        replaceTextInDocument(document, "20110678", student1.getStudentId());
                    } else {
                        replaceTextInDocument(document, "Nguyễn Thị Na", " ");
                        replaceTextInDocument(document, "20110678", " ");
                    }
                }
                if (subject.getStudent2() != null) {
                    Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                    if (student2 != null) {
                        replaceTextInDocument(document, "Nguyễn Thị Trang", student2.getPerson().getFirstName() + student2.getPerson().getLastName());
                        replaceTextInDocument(document, "20110679", student2.getStudentId());
                    } else {
                        replaceTextInDocument(document, "Nguyễn Thị Trang", " ");
                        replaceTextInDocument(document, "20110679", " ");
                    }
                }
                if (subject.getStudent3() != null) {
                    Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                    if (student3 != null) {
                        replaceTextInDocument(document, "Nguyễn Thị Thùy", student3.getPerson().getFirstName() + " " + student3.getPerson().getLastName());
                        replaceTextInDocument(document, "20110789", student3.getStudentId());
                    } else {
                        replaceTextInDocument(document, "Nguyễn Thị Thùy", " ");
                        replaceTextInDocument(document, "20110789", " ");
                    }
                }

                // Thay thế dữ liệu trong file mẫu
                replaceTextInDocument(document, "Xây dựng website", subject.getSubjectName());

                if (subject.getInstructorId() != null) {
                    Lecturer lecturer = subject.getInstructorId();
                    replaceTextInDocument(document, "Trần Văn A", lecturer.getPerson().getFirstName() + lecturer.getPerson().getLastName());
                }

                // Lưu file đã chỉnh sửa
                try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                    document.write(fos);
                }

                // Đọc và in nội dung tài liệu đã chỉnh sửa
                try (FileInputStream fis = new FileInputStream(outputFile);
                     XWPFDocument docToPrint = new XWPFDocument(fis)) {
                    System.out.println("Nội dung tài liệu đã chỉnh sửa:");
                    for (XWPFParagraph paragraph : docToPrint.getParagraphs()) {
                        System.out.println("Paragraph: " + paragraph.getText());
                    }
                    for (XWPFTable table : docToPrint.getTables()) {
                        for (XWPFTableRow row : table.getRows()) {
                            for (XWPFTableCell cell : row.getTableCells()) {
                                System.out.println("Table Cell: " + cell.getText());
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace(); // In ra lỗi để kiểm tra
        }
    }


    private void replaceTextInDocument(XWPFDocument document, String findText, String replaceText) {
        for (XWPFParagraph p : document.getParagraphs()) {
            for (XWPFRun r : p.getRuns()) {
                String text = r.getText(0);
                if (text != null && text.contains(findText)) {
                    text = text.replace(findText, replaceText);
                    r.setText(text, 0);
                }
            }
        }
    }


    public void appendTextAfterKeyword(XWPFDocument document, String keyword, String textToAppend) {
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            String paragraphText = paragraph.getText();
            if (paragraphText.contains(keyword)) {
                List<XWPFRun> runs = paragraph.getRuns();
                for (int i = 0; i < runs.size(); i++) {
                    XWPFRun run = runs.get(i);
                    String runText = run.getText(0);
                    if (runText != null && runText.contains(keyword)) {
                        runText = runText.replace(keyword, keyword + " " + textToAppend);
                        run.setText(runText, 0);
                        break;
                    }
                }
            }
        }
    }

    public void exportReviewByThesisFile(String outputPath, int subjectId) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/NhanXetGVPB.docx");

        XWPFDocument document = new XWPFDocument(inputStream);

        // Lấy dữ liệu từ cơ sở dữ liệu
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject != null) {
            // Tìm kết quả theo đề tài
            if (subject.getStudent1() != null) {
                Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                if (student1 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 1 :", student1.getPerson().getFirstName() + " " + student1.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 1:", student1.getStudentId());
                }
            }
            if (subject.getStudent2() != null) {
                Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                if (student2 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 2 :", student2.getPerson().getFirstName() + " " + student2.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 2:", student2.getStudentId());
                }
            }
            if (subject.getStudent3() != null) {
                Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                if (student3 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 3 :", student3.getPerson().getFirstName() + " " + student3.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 3:", student3.getStudentId());
                }
            }

            // Thay thế dữ liệu trong file mẫu
            appendTextAfterKeyword(document, "Tên đề tài:", subject.getSubjectName());

            if (subject.getThesisAdvisorId() != null) {
                Lecturer lecturer = subject.getThesisAdvisorId();
                appendTextAfterKeyword(document, "Họ và tên Giáo viên phản biện:", lecturer.getPerson().getFirstName() + " " + lecturer.getPerson().getLastName());
            }

            // Lưu file đã chỉnh sửa
            FileOutputStream fos = new FileOutputStream(outputPath);
            document.write(fos);
            fos.close();
            inputStream.close();
        }
    }

}
