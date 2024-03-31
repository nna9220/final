//package com.web.service.Admin;
//
//import com.web.config.CheckRole;
//import com.web.config.TokenUtils;
//import com.web.entity.*;
//import com.web.repository.*;
//import com.web.utils.UserUtils;
//import lombok.RequiredArgsConstructor;
//import org.apache.poi.ss.usermodel.Cell;
//import org.apache.poi.ss.usermodel.CellType;
//import org.apache.poi.ss.usermodel.Row;
//import org.apache.poi.xssf.usermodel.XSSFSheet;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.time.LocalDate;
//import java.util.*;
//
//@Service
//@RequiredArgsConstructor
//public class SubjectImport {
//
//    private final SubjectRepository subjectRepository;
//    private final TypeSubjectRepository typeSubjectRepository;
//    private final PersonRepository personRepository;
//    private final UserUtils userUtils;
//    private final LecturerRepository lecturerRepository;
//    private final StudentRepository studentRepository;
//    private final TokenUtils tokenUtils;
//
//    public ResponseEntity<?> importSubject(MultipartFile file) throws IOException {
//        try {
//            TypeSubject typeSubject = typeSubjectRepository.findById(1).orElse(null);
//            TypeSubject typeSubject2 = typeSubjectRepository.findById(2).orElse(null);
//            List<Subject> saveSub = new ArrayList<>();
//            Set<Student> saveStudent = new HashSet<>();
//            LocalDate nowYear = LocalDate.now();
//            if (checkExcelFormat(file)) {
//                Map<String, List<?>> result = toSubjects(file.getInputStream());
//                List<Subject> tlcn = (List<Subject>) result.get("tlcn");
//                List<Subject> kltn = (List<Subject>) result.get("kltn");
//                tlcn.forEach(subject -> {
//                    System.out.println("TLCN Mã GVHD" + subject.getThesisAdvisorId() );
//                    System.out.println("TLCN Mã GVPB" + subject.getThesisAdvisorId() );
//                    System.out.println("Student 1: " + subject.getStudent1());
//                    System.out.println("Student 2: " + subject.getStudent2());
//                    System.out.println("Student 3: " + subject.getStudent3());
//                });
//                kltn.forEach(subject -> {
//                    System.out.println("KL Mã GVHD" + subject.getThesisAdvisorId() );
//                    System.out.println("KL Mã GVPB" + subject.getThesisAdvisorId() );
//                    System.out.println("Student 1: " + subject.getStudent1());
//                    System.out.println("Student 2: " + subject.getStudent2());
//                    System.out.println("Student 3: " + subject.getStudent3());
//                });
//                //TLCN
//                /*tlcn.forEach(subject -> {
//                    Subject newSubject = new Subject();
//                    newSubject.setSubjectName(subject.getSubjectName());
//                    newSubject.setYear(String.valueOf(nowYear));
//                    newSubject.setTypeSubject(typeSubject);
//                    newSubject.setActive((byte) 1);
//                    newSubject.setStatus(true);
//                    if (subject.getStudent1()!=null) {
//                        Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
//                        if (student1 != null) {
//                            if (student1.getSubjectId() == null) {
//                                newSubject.setStudent1(subject.getStudent1());
//                                student1.setSubjectId(newSubject);
//                                newSubject.setMajor(student1.getMajor());
//                                saveStudent.add(student1);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent1(null);
//                    }
//                    if (subject.getStudent2()!=null) {
//                        Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
//                        if (student2 != null) {
//                            if (student2.getSubjectId() == null) {
//                                newSubject.setStudent2(subject.getStudent2());
//                                student2.setSubjectId(newSubject);
//                                saveStudent.add(student2);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent2(null);
//                    }
//                    if (subject.getStudent3()!=null) {
//                        Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
//                        if (student3 != null) {
//                            if (student3.getSubjectId() == null) {
//                                newSubject.setStudent2(subject.getStudent2());
//                                student3.setSubjectId(newSubject);
//                                saveStudent.add(student3);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent3(null);
//                    }
//                    if (subject.getInstructorId()!=null) {
//                        newSubject.setInstructorId(subject.getInstructorId());
//                    }
//                    if (subject.getThesisAdvisorId()!=null) {
//                        newSubject.setThesisAdvisorId(subject.getThesisAdvisorId());
//                    }
//                    saveSub.add(newSubject);
//                    System.out.println("Luu TLCN Thanh Cong");
//                });
//
//                //KLTN
//
//                kltn.forEach(subject -> {
//                    Subject newSubject = new Subject();
//                    newSubject.setSubjectName(subject.getSubjectName());
//                    newSubject.setYear(String.valueOf(nowYear));
//                    newSubject.setTypeSubject(typeSubject2);
//                    newSubject.setActive((byte) 1);
//                    newSubject.setStatus(true);
//                    if (subject.getStudent1()!=null) {
//                        Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
//                        if (student1 != null) {
//                            if (student1.getSubjectGraduationId() == null) {
//                                newSubject.setStudent1(subject.getStudent1());
//                                student1.setSubjectGraduationId(newSubject);
//                                newSubject.setMajor(student1.getMajor());
//                                saveStudent.add(student1);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent1(null);
//                    }
//                    if (subject.getStudent2()!=null) {
//                        Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
//                        if (student2 != null) {
//                            if (student2.getSubjectGraduationId() == null) {
//                                newSubject.setStudent2(subject.getStudent2());
//                                student2.setSubjectGraduationId(newSubject);
//                                saveStudent.add(student2);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent2(null);
//                    }
//                    if (subject.getStudent3()!=null) {
//                        Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
//                        if (student3 != null) {
//                            if (student3.getSubjectGraduationId() == null) {
//                                newSubject.setStudent2(subject.getStudent2());
//                                student3.setSubjectGraduationId(newSubject);
//                                saveStudent.add(student3);
//                            }
//                        }
//                    }else {
//                        newSubject.setStudent3(null);
//                    }
//                    if (subject.getInstructorId()!=null) {
//                        newSubject.setInstructorId(subject.getInstructorId());
//                    }
//                    if (subject.getThesisAdvisorId()!=null) {
//                        newSubject.setThesisAdvisorId(subject.getThesisAdvisorId());
//                    }
//                    saveSub.add(newSubject);
//                    System.out.println("Luu KLTN Thanh Cong");
//                });
//                *//*subjectRepository.saveAll(saveSub);
//                studentRepository.saveAll(saveStudent);*/
//
//                return ResponseEntity.ok("Imported file to list subject successful!");
//            } else
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not match format, please try again!");
//        }catch (Exception e){
//            throw new RuntimeException("Lỗi r" + e.getMessage());
//        }
//    }
//
//
//    public boolean checkExcelFormat(MultipartFile file){
//        String contentType = file.getContentType();
//        if (contentType == null) throw new AssertionError();
//        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//    }
//    public Map<String, List<?>> toSubjects(InputStream inputStream){
//        List<Subject> subjects_TLCN = new ArrayList<>();
//        List<Subject> subjects_KLTN = new ArrayList<>();
//        try{
//            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
//            XSSFSheet sheet = workbook.getSheet("TLCN");
//            int rowNumber = 0;
//            for (Row row : sheet) {
//                if (rowNumber == 0) {
//                    rowNumber++;
//                    continue;
//                }
//                Iterator<Cell> cells = row.iterator();
//                int cid = 0;
//                Subject subject = new Subject();
//                while (cells.hasNext()) {
//                    Cell cell = cells.next();
//                    switch (cid) {
//                        case 0 -> subject.setSubjectName(cell.getStringCellValue());
//                        case 1 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent1(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent1(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent1(null); // Hoặc đặt giá trị mặc định phù hợp
//                            } else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//// Similar adjustments for student_2
//                        case 2 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent2(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent2(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent2(null); // Gán null cho student_2 nếu ô trong file Excel là trống
//                            } else {
//                                throw new IllegalStateException("Unsupported cell type at column 3, row " + row.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 3 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent3(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent2(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent3(null); // Hoặc đặt giá trị mặc định phù hợp
//                            } else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 4 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                Lecturer intruc = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
//                                subject.setInstructorId(intruc);
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                Lecturer intruc = lecturerRepository.findById(stringValue).orElse(null);
//                                subject.setInstructorId(intruc);
//                            }else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 5 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                Lecturer thesis = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
//                                subject.setThesisAdvisorId(thesis);
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                Lecturer thesis = lecturerRepository.findById(stringValue).orElse(null);
//                                subject.setThesisAdvisorId(thesis);
//                            }else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        default -> {
//                            throw new IllegalStateException("Unsupported cell type at column " + cid + ", row " + row.getRowNum() +
//                                    ". Cell type: " + cell.getCellType());
//                        }
//                    }
//                    cid++;
//                }
//                subjects_TLCN.add(subject);
//            }
//
//
//            //Khóa luận TN
//
//            XSSFSheet sheet2 = workbook.getSheet("KLTN");
//            int rowNumber2 = 0;
//            for (Row row2 : sheet2) {
//                if (rowNumber2 == 0) {
//                    rowNumber2++;
//                    continue;
//                }
//                Iterator<Cell> cells = row2.iterator();
//                int cid = 0;
//                Subject subject = new Subject();
//                while (cells.hasNext()) {
//                    Cell cell = cells.next();
//                    switch (cid) {
//                        case 0 -> subject.setSubjectName(cell.getStringCellValue());
//                        case 1 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent1(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent1(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent1(null); // Hoặc đặt giá trị mặc định phù hợp
//                            } else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row2.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//// Similar adjustments for student_2
//                        case 2 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent2(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent2(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent2(null); // Gán null cho student_2 nếu ô trong file Excel là trống
//                            } else {
//                                throw new IllegalStateException("Unsupported cell type at column 3, row " + row2.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 3 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                subject.setStudent3(cell.getStringCellValue());
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                subject.setStudent2(stringValue);
//                            } else if (cell.getCellType() == CellType.BLANK) {
//                                subject.setStudent3(null); // Hoặc đặt giá trị mặc định phù hợp
//                            } else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row2.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 4 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                Lecturer intruc = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
//                                subject.setInstructorId(intruc);
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                Lecturer intruc = lecturerRepository.findById(stringValue).orElse(null);
//                                subject.setInstructorId(intruc);
//                            }else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row2.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        case 5 -> {
//                            if (cell.getCellType() == CellType.STRING) {
//                                Lecturer thesis = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
//                                subject.setThesisAdvisorId(thesis);
//                            } else if (cell.getCellType() == CellType.NUMERIC) {
//                                // Xử lý giá trị số nguyên thành chuỗi
//                                int numericValue = (int) cell.getNumericCellValue();
//                                String stringValue = String.valueOf(numericValue);
//                                Lecturer thesis = lecturerRepository.findById(stringValue).orElse(null);
//                                subject.setThesisAdvisorId(thesis);
//                            }else {
//                                // Xử lý các loại ô khác không được hỗ trợ hoặc ném ra ngoại lệ
//                                throw new IllegalStateException("Unsupported cell type at column 6, row " + row2.getRowNum() +
//                                        ". Cell type: " + cell.getCellType());
//                            }
//                        }
//                        default -> {
//                            throw new IllegalStateException("Unsupported cell type at column " + cid + ", row " + row2.getRowNum() +
//                                    ". Cell type: " + cell.getCellType());
//                        }
//                    }
//                    cid++;
//                }
//                subjects_KLTN.add(subject);
//            }
//
//
//        } catch (Exception e){
//            throw new RuntimeException("Error when convert file csv!" + e.getMessage());
//        }
//        HashMap<String, List<?>> map = new HashMap<>();
//        map.put("tlcn", subjects_TLCN);
//        map.put("kltn", subjects_KLTN);
//        return map;
//    }
//
//
//}