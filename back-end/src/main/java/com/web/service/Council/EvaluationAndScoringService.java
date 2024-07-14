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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EvaluationAndScoringService {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private CouncilReportTimeRepository councilReportTimeRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ScoreEssayRepository scoreEssayRepository;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;

    //Của GV trong hội đồng
    //Sau khi GVPB duyệt active =7
    //Get list hội đồng của GV tgia
    //Get detail 1 hội đồng (Đè tài-Ngày giờ phản biện-Giảng viên trong hội đồng)
    //Get detail đề tài phản biện của hội đồng (Thông tin đề tài - Tiêu chí đánh giá - Chấm điểm - Đánh giá)
    //Giảng viên đánh giá, chấm điểm cho từng sinh viên


    //Lấy ra danh sách đề tài phản biện của GV hiện tại, status = true, active=6, typeSubject
    public ResponseEntity<?> getListCouncilOfLecturer(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<CouncilReportTime> councilReportTimes = councilReportTimeRepository.findCouncilReportTimeByTypeSubjectAndStatus(typeSubject, true);
            if (!CompareTime.isCouncilTimeWithinAnyCouncilReportTime(councilReportTimes)) {
                return new ResponseEntity<>("Không nằm trong khoảng thời gian hội đồng được tổ chức.", HttpStatus.BAD_REQUEST);
            }
            List<Council> councils = councilRepository.getListCouncilByLecturer(existedLecturer);
            List<Council> councilResponse = new ArrayList<>();
            for (Council council:councils) {
                Subject subject = council.getSubject();
                System.out.println("before chẹc type");
                System.out.println("type: " + council.getSubject().getTypeSubject().getTypeName());
                if (council.getSubject().getTypeSubject()==typeSubject){
                    System.out.println("before check status");
                    if (subject.isStatus()) {
                        System.out.println("before chekc active");
                        if (subject.getActive() == (byte)8) {
                            System.out.println("goal");
                            councilResponse.add(council);
                            System.out.println("council: " + council);
                            System.out.println("subject: "+subject.getSubjectName());
                        }
                    }
                }
            }
            for (Council c:councilResponse) {
                System.out.println(c.getSubject().getSubjectName());
            }
            return new ResponseEntity<>(councilResponse,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<Map<String,Object>> getListCouncilOfLecturerGraduation(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Council> councils = councilRepository.getListCouncilByLecturer(existedLecturer);
            List<Council> councilResponse = new ArrayList<>();
            for (Council council:councils) {
                Subject subject = council.getSubject();
                System.out.println("before chẹc type");
                System.out.println("type: " + council.getSubject().getTypeSubject().getTypeName());
                if (council.getSubject().getTypeSubject()==typeSubject){
                    System.out.println("before check status");
                    if (subject.isStatus()) {
                        System.out.println("before chekc active");
                        if (subject.getActive() == (byte)8) {
                            System.out.println("goal");
                            councilResponse.add(council);
                            System.out.println("council: " + council);
                            System.out.println("subject: "+subject.getSubjectName());
                        }
                    }
                }
            }
            List<Subject> list = new ArrayList<>();
            for (Council c:councilResponse) {
                System.out.println(c.getSubject().getSubjectName());
                list.add(c.getSubject());
            }
            Map<String,Object> response = new HashMap<>();
            response.put("council",councilResponse);
            response.put("subjects",list);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }




    //Chi tiết council -- get detail của subject từ council
    public ResponseEntity<Map<String,Object>> detailCouncil(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
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
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<Map<String,Object>> detailSubjectLecturerCouncil(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
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
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    public ResponseEntity<Map<String,Object>> detailSubject(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                Map<String,Object> response = new HashMap<>();
                response.put("council", existedSubject.getCouncil());
                response.put("subject",existedSubject);
                return new ResponseEntity<>(response,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //GV chấm điểm cho từng sinh viên và đánh giá - TLCN - Hội đồng là GVHD và GVPB
   /* public ResponseEntity<?> evaluationAndScoringEssay(String authorizationHeader, int subjectId,
                                                       String studentId1,String studentId2,String studentId3,
                                                       String reviewStudent1, String reviewStudent2, String reviewStudent3,
                                                       Double scoreStudent1, Double scoreStudent2, Double scoreStudent3) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject!=null){
                //Kiểm tra xem có tồn tại SVTH k
                if (existedSubject.getStudent1()!=null){
                    //Tìm Sv
                    Student student1 = studentRepository.findById(studentId1).orElse(null);
                    if (student1!=null) {
                        //Kiểm tra xem student này đã có kết quả chưa
                        ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student1, existedSubject);
                        if (existedResultEssay == null) {
                            //nếu chưa có, tạo mới 1 result
                            ResultEssay resultEssayStudent1 = new ResultEssay();
                            resultEssayStudent1.setSubject(existedSubject);
                            resultEssayStudent1.setStudent(student1);
                            if (existedLecturer == existedSubject.getInstructorId()) {
                                resultEssayStudent1.setScoreInstructor(scoreStudent1);
                                resultEssayStudent1.setReviewInstructor(reviewStudent1);
                            } else if (existedLecturer == existedSubject.getThesisAdvisorId()) {
                                resultEssayStudent1.setScoreThesis(scoreStudent1);
                                resultEssayStudent1.setReviewThesis(reviewStudent1);
                            }
                            subjectRepository.save(existedSubject);
                            resultEssayRepository.save(resultEssayStudent1);
                            student1.setResultEssay(resultEssayStudent1);
                            studentRepository.save(student1);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            System.out.println("Có r");
                            if (existedResultEssay.getScoreThesis()==null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent1);
                                existedResultEssay.setReviewThesis(reviewStudent1);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student1);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                student1.setResultEssay(existedResultEssay);
                                existedSubject.setActive((byte)9);
                                studentRepository.save(student1);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent1);
                                existedResultEssay.setReviewInstructor(reviewStudent1);
                                existedResultEssay.setSubject(existedSubject);
                                existedSubject.setActive((byte)9);
                                existedResultEssay.setStudent(student1);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                student1.setResultEssay(existedResultEssay);
                                studentRepository.save(student1);
                            }
                        }
                    }
                }
                //student2
                if (existedSubject.getStudent2()!=null){
                    //Tìm Sv
                    Student student2 = studentRepository.findById(studentId2).orElse(null);
                    if (student2!=null) {
                        //Kiểm tra xem student này đã có kết quả chưa
                        ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student2, existedSubject);
                        if (existedResultEssay == null) {
                            //nếu chưa có, tạo mới 1 result
                            ResultEssay resultEssayStudent2 = new ResultEssay();
                            resultEssayStudent2.setSubject(existedSubject);
                            resultEssayStudent2.setStudent(student2);
                            if (existedLecturer == existedSubject.getInstructorId()) {
                                resultEssayStudent2.setScoreInstructor(scoreStudent2);
                                resultEssayStudent2.setReviewInstructor(reviewStudent2);
                            } else if (existedLecturer == existedSubject.getThesisAdvisorId()) {
                                resultEssayStudent2.setScoreThesis(scoreStudent2);
                                resultEssayStudent2.setReviewThesis(reviewStudent2);
                            }
                            subjectRepository.save(existedSubject);
                            resultEssayRepository.save(resultEssayStudent2);
                            student2.setResultEssay(resultEssayStudent2);
                            studentRepository.save(student2);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            if (existedResultEssay.getScoreThesis()==null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent2);
                                existedResultEssay.setReviewThesis(reviewStudent2);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student2);
                                existedSubject.setActive((byte)9);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                student2.setResultEssay(existedResultEssay);
                                studentRepository.save(student2);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent2);
                                existedResultEssay.setReviewInstructor(reviewStudent2);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student2);
                                existedSubject.setActive((byte)9);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                student2.setResultEssay(existedResultEssay);
                                studentRepository.save(student2);
                            }
                        }
                    }
                }

                //student3
                if (existedSubject.getStudent3()!=null){
                    //Tìm Sv
                    Student student3 = studentRepository.findById(studentId3).orElse(null);
                    if (student3!=null) {
                        //Kiểm tra xem student này đã có kết quả chưa
                        ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student3, existedSubject);
                        if (existedResultEssay == null) {
                            //nếu chưa có, tạo mới 1 result
                            ResultEssay resultEssayStudent3 = new ResultEssay();
                            resultEssayStudent3.setSubject(existedSubject);
                            resultEssayStudent3.setStudent(student3);
                            if (existedLecturer == existedSubject.getInstructorId()) {
                                resultEssayStudent3.setScoreInstructor(scoreStudent3);
                                resultEssayStudent3.setReviewInstructor(reviewStudent3);
                            } else if (existedLecturer == existedSubject.getThesisAdvisorId()) {
                                resultEssayStudent3.setScoreThesis(scoreStudent3);
                                resultEssayStudent3.setReviewThesis(reviewStudent3);
                            }
                            subjectRepository.save(existedSubject);
                            resultEssayRepository.save(resultEssayStudent3);
                            student3.setResultEssay(resultEssayStudent3);
                            studentRepository.save(student3);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            if (existedResultEssay.getScoreThesis()==null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent3);
                                existedResultEssay.setReviewThesis(reviewStudent3);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student3);
                                existedSubject.setActive((byte)9);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                studentRepository.save(student3);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent3);
                                existedResultEssay.setReviewInstructor(reviewStudent3);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student3);
                                existedSubject.setActive((byte)9);
                                subjectRepository.save(existedSubject);
                                resultEssayRepository.save(existedResultEssay);
                                studentRepository.save(student3);
                            }
                        }
                    }
                }
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }*/


    //CHẤM ĐIỂM TLCN
    public ResponseEntity<?> evaluationAndScoringEssay(String authorizationHeader, int subjectId,
                                                            String studentId1,String studentId2,String studentId3,
                                                            String reviewStudent1, String reviewStudent2, String reviewStudent3,
                                                            Double scoreStudent1, Double scoreStudent2, Double scoreStudent3){
        // Thêm logging để kiểm tra dữ liệu đầu vào
        System.out.println("Received data: studentId1 = " + studentId1 + ", studentId2 = " + studentId2 +
                ", studentId3 = " + studentId3 + ", scoreStudent1 = " + scoreStudent1 +
                ", scoreStudent2 = " + scoreStudent2 + ", scoreStudent3 = " + scoreStudent3 +
                ", reviewStudent1 = " + reviewStudent1 + ", reviewStudent2 = " + reviewStudent2 +
                ", reviewStudent3 = " + reviewStudent3);

        // Tiếp tục logic xử lý...
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        System.out.println("Trước check role");
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            System.out.println("Sau check role");
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            System.out.println("Council:  " + existedSubject.getCouncil().getAddress());
            System.out.println("Check var compare: " + CompareTime.isCurrentTimeInCouncilTime(existedSubject.getCouncil()));
            if (CompareTime.isCurrentTimeInCouncilTime(existedSubject.getCouncil())) {
                //Đếm số luượng giảng viên trong hội đồng - đếm số lượng councillecturer của council đó
                List<CouncilLecturer> councilLecturerByCouncil = councilLecturerRepository.getListCouncilLecturerByCouncil(existedSubject.getCouncil());
                int countLecturers = councilLecturerByCouncil.size();
                if (existedSubject != null) {
                    //Kiểm tra xem có tồn tại SVTH k - Student 1
                    if (existedSubject.getStudent1() != null) {
                        //Tìm Sv
                        Student student1 = studentRepository.findById(studentId1).orElse(null);
                        if (student1 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student1,existedSubject);
                            if (existedResultEssay == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultEssay resultEssay = new ResultEssay();
                                ScoreEssay scoreEssay = new ScoreEssay();
                                //Set sinh viên và đề tài cho result này
                                resultEssay.setStudent(student1);
                                resultEssay.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreEssay.setScore(scoreStudent1);
                                scoreEssay.setByLecturer(existedLecturer);
                                scoreEssay.setReview(reviewStudent1);
                                scoreEssay.setResultEssay(resultEssay);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                scoreEssayList.add(scoreEssay);
                                resultEssay.setScoreCouncil(scoreEssayList);
                                resultEssayRepository.save(resultEssay);
                                scoreEssayRepository.save(scoreEssay);
                                //Tạo mới list result để gán cho subject
                                List<ResultEssay> resultEssays = new ArrayList<>();
                                resultEssays.add(resultEssay);
                                existedSubject.setResultEssays(resultEssays);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreEssayList(scoreEssayList);
                                lecturerRepository.save(existedLecturer);
                                student1.setResultEssay(resultEssay);
                                studentRepository.save(student1);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreEssay existedScoreEssay = scoreEssayRepository.getScoreEssayByLecturerAndReAndResultEssay(existedLecturer, existedResultEssay);
                                if (existedScoreEssay == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreEssay scoreEssay = new ScoreEssay();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreEssay.setScore(scoreStudent1);
                                    scoreEssay.setByLecturer(existedLecturer);
                                    scoreEssay.setReview(reviewStudent1);
                                    scoreEssay.setResultEssay(existedResultEssay);
                                    scoreEssayRepository.save(scoreEssay);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                    scoreEssayList.add(scoreEssay);
                                    existedResultEssay.setScoreCouncil(scoreEssayList);
                                    resultEssayRepository.save(existedResultEssay);
                                    //Tạo mới list result để gán cho subject
                                    List<ResultEssay> resultEssays = new ArrayList<>();
                                    resultEssays.add(existedResultEssay);
                                    existedSubject.setResultEssays(resultEssays);
                                    //đếm số lượng score của result student 1 rồi ó sánh với countLecturers
                                    if (student1.getResultEssay().getScoreCouncil().size() == countLecturers) {
                                        existedSubject.setActive((byte) 9);
                                    }

                                    existedLecturer.setScoreEssayList(scoreEssayList);
                                    lecturerRepository.save(existedLecturer);
                                    student1.setResultEssay(existedResultEssay);
                                    studentRepository.save(student1);
                                    //Sau khi lưu kết quả, check số lượng kết quả của subject và student này
                                    //Nếu bằng số lượng GV trong hội đồng và GVHD đã chấm điểm thì cho active = 9
                                    //Tìm Kết quả
                                    ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student1, existedSubject);
                                    //Tìm ds điểm của kq đó
                                    List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                                    int countScore = scoreEssays.size();
                                    if (countScore == countLecturers) {
                                        existedSubject.setActive((byte) 9);
                                    }
                                    subjectRepository.save(existedSubject);

                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    //Kiểm tra xem có tồn tại SVTH k - Student 2
                    if (existedSubject.getStudent2() != null) {
                        //Tìm Sv
                        Student student2 = studentRepository.findById(studentId2).orElse(null);
                        if (student2 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student2, existedSubject);
                            if (existedResultEssay == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultEssay resultEssay = new ResultEssay();
                                ScoreEssay scoreEssay = new ScoreEssay();
                                //Set sinh viên và đề tài cho result này
                                resultEssay.setStudent(student2);
                                resultEssay.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreEssay.setScore(scoreStudent2);
                                scoreEssay.setByLecturer(existedLecturer);
                                scoreEssay.setReview(reviewStudent2);
                                scoreEssay.setResultEssay(resultEssay);
                                scoreEssayRepository.save(scoreEssay);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                scoreEssayList.add(scoreEssay);
                                resultEssay.setScoreCouncil(scoreEssayList);
                                resultEssayRepository.save(resultEssay);
                                //Tạo mới list result để gán cho subject
                                List<ResultEssay> resultEssays = new ArrayList<>();
                                resultEssays.add(resultEssay);
                                existedSubject.setResultEssays(resultEssays);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreEssayList(scoreEssayList);
                                lecturerRepository.save(existedLecturer);
                                student2.setResultEssay(resultEssay);
                                studentRepository.save(student2);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreEssay existedScoreEssay = scoreEssayRepository.getScoreEssayByLecturerAndReAndResultEssay(existedLecturer,existedResultEssay);
                                if (existedScoreEssay == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreEssay scoreEssay = new ScoreEssay();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreEssay.setScore(scoreStudent2);
                                    scoreEssay.setByLecturer(existedLecturer);
                                    scoreEssay.setReview(reviewStudent2);
                                    scoreEssay.setResultEssay(existedResultEssay);
                                    scoreEssayRepository.save(scoreEssay);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                    scoreEssayList.add(scoreEssay);
                                    existedResultEssay.setScoreCouncil(scoreEssayList);
                                    resultEssayRepository.save(existedResultEssay);
                                    //Tạo mới list result để gán cho subject
                                    List<ResultEssay> resultEssays = new ArrayList<>();
                                    resultEssays.add(existedResultEssay);
                                    existedSubject.setResultEssays(resultEssays);
                                    subjectRepository.save(existedSubject);
                                    existedLecturer.setScoreEssayList(scoreEssayList);
                                    lecturerRepository.save(existedLecturer);
                                    student2.setResultEssay(existedResultEssay);
                                    studentRepository.save(student2);
                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    //Kiểm tra xem có tồn tại SVTH k - Student 1
                    if (existedSubject.getStudent3() != null) {
                        //Tìm Sv
                        Student student3 = studentRepository.findById(studentId3).orElse(null);
                        if (student3 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultEssay existedResultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student3, existedSubject);
                            if (existedResultEssay == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultEssay resultEssay = new ResultEssay();
                                ScoreEssay scoreEssay = new ScoreEssay();
                                //Set sinh viên và đề tài cho result này
                                resultEssay.setStudent(student3);
                                resultEssay.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreEssay.setScore(scoreStudent3);
                                scoreEssay.setByLecturer(existedLecturer);
                                scoreEssay.setReview(reviewStudent3);
                                scoreEssay.setResultEssay(resultEssay);
                                scoreEssayRepository.save(scoreEssay);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                scoreEssayList.add(scoreEssay);
                                resultEssay.setScoreCouncil(scoreEssayList);
                                resultEssayRepository.save(resultEssay);
                                //Tạo mới list result để gán cho subject
                                List<ResultEssay> resultEssays = new ArrayList<>();
                                resultEssays.add(resultEssay);
                                existedSubject.setResultEssays(resultEssays);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreEssayList(scoreEssayList);
                                lecturerRepository.save(existedLecturer);
                                student3.setResultEssay(resultEssay);
                                studentRepository.save(student3);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreEssay existedScoreEssay = scoreEssayRepository.getScoreEssayByLecturerAndReAndResultEssay(existedLecturer, existedResultEssay);
                                if (existedScoreEssay == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreEssay scoreEssay = new ScoreEssay();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreEssay.setScore(scoreStudent3);
                                    scoreEssay.setByLecturer(existedLecturer);
                                    scoreEssay.setReview(reviewStudent3);
                                    scoreEssay.setResultEssay(existedResultEssay);
                                    scoreEssayRepository.save(scoreEssay);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreEssay> scoreEssayList = new ArrayList<>();
                                    scoreEssayList.add(scoreEssay);
                                    existedResultEssay.setScoreCouncil(scoreEssayList);
                                    resultEssayRepository.save(existedResultEssay);
                                    //Tạo mới list result để gán cho subject
                                    List<ResultEssay> resultEssays = new ArrayList<>();
                                    resultEssays.add(existedResultEssay);
                                    existedSubject.setResultEssays(resultEssays);
                                    subjectRepository.save(existedSubject);
                                    existedLecturer.setScoreEssayList(scoreEssayList);
                                    lecturerRepository.save(existedLecturer);
                                    student3.setResultEssay(existedResultEssay);
                                    studentRepository.save(student3);
                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



    //đánh giá chấm điểm kltn
    //mỗi sv c 1 result
    //1 result có nhiều score-graduation và 1 điểm của GVHD
    //1 score-graduation do 1 GV chấm điểm và đánh giá
    //1 GV trong hội đồng sẽ chấm cho 3 SV
    //Mỗi 1 giao diện của GV chấm điểm load ra 3 cột của 3 sinh viên và các tiêu chí chấm điểm của đề tài đó
    //Tổng điểm các tiêu chí và đánh giá sinh viên ở hàng cuối cùng
    //Lấy chi tiết đề tài để lấy được thng tin các SV và tiêu chí
    //Tạo mới 1 Result cho mỗi sv
    //Sau đó tạo mới 1 score-graduation connect với Result đó
    //Result này connect đến với subject - mỗi subject có nhiều nhất 3 result
    //giữ nguyên active khi chấm, sau đó check riêng nếu đã đủ GV chấm thì chuyển qua active=9
    public ResponseEntity<?> evaluationAndScoringGraduation(String authorizationHeader, int subjectId,
                                                            String studentId1,String studentId2,String studentId3,
                                                            String reviewStudent1, String reviewStudent2, String reviewStudent3,
                                                            Double scoreStudent1, Double scoreStudent2, Double scoreStudent3){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {

            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (CompareTime.isCurrentTimeInCouncilTime(existedSubject.getCouncil())) {
                //Đếm số luượng giảng viên trong hội đồng - đếm số lượng councillecturer của council đó
                List<CouncilLecturer> councilLecturerByCouncil = councilLecturerRepository.getListCouncilLecturerByCouncil(existedSubject.getCouncil());
                int countLecturers = councilLecturerByCouncil.size();
                if (existedSubject != null) {
                    //Kiểm tra xem có tồn tại SVTH k - Student 1
                    if (existedSubject.getStudent1() != null) {
                        //Tìm Sv
                        Student student1 = studentRepository.findById(studentId1).orElse(null);
                        if (student1 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultGraduation existedResultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student1, existedSubject);
                            if (existedResultGraduation == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultGraduation resultGraduation = new ResultGraduation();
                                ScoreGraduation scoreGraduation = new ScoreGraduation();
                                //Set sinh viên và đề tài cho result này
                                resultGraduation.setStudent(student1);
                                resultGraduation.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreGraduation.setScore(scoreStudent1);
                                scoreGraduation.setByLecturer(existedLecturer);
                                scoreGraduation.setReview(reviewStudent1);
                                scoreGraduation.setResultGraduation(resultGraduation);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                scoreGraduationList.add(scoreGraduation);
                                resultGraduation.setScoreCouncil(scoreGraduationList);
                                resultGraduationRepository.save(resultGraduation);
                                scoreGraduationRepository.save(scoreGraduation);
                                //Tạo mới list result để gán cho subject
                                List<ResultGraduation> resultGraduations = new ArrayList<>();
                                resultGraduations.add(resultGraduation);
                                existedSubject.setResultGraduations(resultGraduations);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreGraduationList(scoreGraduationList);
                                lecturerRepository.save(existedLecturer);
                                student1.setResultGraduation(resultGraduation);
                                studentRepository.save(student1);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreGraduation existedScoreGraduation = scoreGraduationRepository.getScoreGraduationByLecturerAndReAndResultGraduation(existedLecturer, existedResultGraduation);
                                if (existedScoreGraduation == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreGraduation scoreGraduation = new ScoreGraduation();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreGraduation.setScore(scoreStudent1);
                                    scoreGraduation.setByLecturer(existedLecturer);
                                    scoreGraduation.setReview(reviewStudent1);
                                    scoreGraduation.setResultGraduation(existedResultGraduation);
                                    scoreGraduationRepository.save(scoreGraduation);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                    scoreGraduationList.add(scoreGraduation);
                                    existedResultGraduation.setScoreCouncil(scoreGraduationList);
                                    resultGraduationRepository.save(existedResultGraduation);
                                    //Tạo mới list result để gán cho subject
                                   

                                    existedLecturer.setScoreGraduationList(scoreGraduationList);
                                    lecturerRepository.save(existedLecturer);
                                    student1.setResultGraduation(existedResultGraduation);
                                    studentRepository.save(student1);
                                    //Sau khi lưu kết quả, check số lượng kết quả của subject và student này
                                    //Nếu bằng số lượng GV trong hội đồng và GVHD đã chấm điểm thì cho active = 9
                                    //Tìm Kết quả
                                    ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student1, existedSubject);
                                    //Tìm ds điểm của kq đó
                                    List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                                    int countScore = scoreGraduations.size();
                                    if (countScore == countLecturers && resultGraduation.getScoreInstructor() != null) {
                                        existedSubject.setActive((byte) 9);
                                    }
                                    subjectRepository.save(existedSubject);

                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    //Kiểm tra xem có tồn tại SVTH k - Student 2
                    if (existedSubject.getStudent2() != null) {
                        //Tìm Sv
                        Student student2 = studentRepository.findById(studentId2).orElse(null);
                        if (student2 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultGraduation existedResultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student2, existedSubject);
                            if (existedResultGraduation == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultGraduation resultGraduation = new ResultGraduation();
                                ScoreGraduation scoreGraduation = new ScoreGraduation();
                                //Set sinh viên và đề tài cho result này
                                resultGraduation.setStudent(student2);
                                resultGraduation.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreGraduation.setScore(scoreStudent2);
                                scoreGraduation.setByLecturer(existedLecturer);
                                scoreGraduation.setReview(reviewStudent2);
                                scoreGraduation.setResultGraduation(resultGraduation);
                                scoreGraduationRepository.save(scoreGraduation);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                scoreGraduationList.add(scoreGraduation);
                                resultGraduation.setScoreCouncil(scoreGraduationList);
                                resultGraduationRepository.save(resultGraduation);
                                //Tạo mới list result để gán cho subject
                                List<ResultGraduation> resultGraduations = new ArrayList<>();
                                resultGraduations.add(resultGraduation);
                                existedSubject.setResultGraduations(resultGraduations);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreGraduationList(scoreGraduationList);
                                lecturerRepository.save(existedLecturer);
                                student2.setResultGraduation(resultGraduation);
                                studentRepository.save(student2);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreGraduation existedScoreGraduation = scoreGraduationRepository.getScoreGraduationByLecturerAndReAndResultGraduation(existedLecturer, existedResultGraduation);
                                if (existedScoreGraduation == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreGraduation scoreGraduation = new ScoreGraduation();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreGraduation.setScore(scoreStudent2);
                                    scoreGraduation.setByLecturer(existedLecturer);
                                    scoreGraduation.setReview(reviewStudent2);
                                    scoreGraduation.setResultGraduation(existedResultGraduation);
                                    scoreGraduationRepository.save(scoreGraduation);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                    scoreGraduationList.add(scoreGraduation);
                                    existedResultGraduation.setScoreCouncil(scoreGraduationList);
                                    resultGraduationRepository.save(existedResultGraduation);
                                    //Tạo mới list result để gán cho subject
                                    List<ResultGraduation> resultGraduations = new ArrayList<>();
                                    resultGraduations.add(existedResultGraduation);
                                    existedSubject.setResultGraduations(resultGraduations);
                                    subjectRepository.save(existedSubject);
                                    existedLecturer.setScoreGraduationList(scoreGraduationList);
                                    lecturerRepository.save(existedLecturer);
                                    student2.setResultGraduation(existedResultGraduation);
                                    studentRepository.save(student2);
                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    //Kiểm tra xem có tồn tại SVTH k - Student 1
                    if (existedSubject.getStudent3() != null) {
                        //Tìm Sv
                        Student student3 = studentRepository.findById(studentId3).orElse(null);
                        if (student3 != null) {
                            //Kiểm tra xem student này đã có kết quả chưa
                            ResultGraduation existedResultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student3, existedSubject);
                            if (existedResultGraduation == null) {
                                //nếu chưa có, tạo mới 1 result - score
                                ResultGraduation resultGraduation = new ResultGraduation();
                                ScoreGraduation scoreGraduation = new ScoreGraduation();
                                //Set sinh viên và đề tài cho result này
                                resultGraduation.setStudent(student3);
                                resultGraduation.setSubject(existedSubject);
                                //Set điểm, giảng viên, đánh giá và result cho score
                                scoreGraduation.setScore(scoreStudent3);
                                scoreGraduation.setByLecturer(existedLecturer);
                                scoreGraduation.setReview(reviewStudent3);
                                scoreGraduation.setResultGraduation(resultGraduation);
                                scoreGraduationRepository.save(scoreGraduation);
                                //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                scoreGraduationList.add(scoreGraduation);
                                resultGraduation.setScoreCouncil(scoreGraduationList);
                                resultGraduationRepository.save(resultGraduation);
                                //Tạo mới list result để gán cho subject
                                List<ResultGraduation> resultGraduations = new ArrayList<>();
                                resultGraduations.add(resultGraduation);
                                existedSubject.setResultGraduations(resultGraduations);
                                subjectRepository.save(existedSubject);
                                existedLecturer.setScoreGraduationList(scoreGraduationList);
                                lecturerRepository.save(existedLecturer);
                                student3.setResultGraduation(resultGraduation);
                                studentRepository.save(student3);
                            } else {
                                //Chỉnh sửa result có sẵn - Kiểm tra xe GV đó cho điểm chưa có rồi thì thông báo đã chấm điểm rồi, không được cấm điểm lại
                                ScoreGraduation existedScoreGraduation = scoreGraduationRepository.getScoreGraduationByLecturerAndReAndResultGraduation(existedLecturer, existedResultGraduation);
                                if (existedScoreGraduation == null) {
                                    //Giảng viên này chưa có score cho result này
                                    //tạo mới score
                                    ScoreGraduation scoreGraduation = new ScoreGraduation();
                                    //Set điểm, giảng viên, đánh giá và result cho score
                                    scoreGraduation.setScore(scoreStudent3);
                                    scoreGraduation.setByLecturer(existedLecturer);
                                    scoreGraduation.setReview(reviewStudent3);
                                    scoreGraduation.setResultGraduation(existedResultGraduation);
                                    scoreGraduationRepository.save(scoreGraduation);
                                    //Tạo mới 1 list score rỗng, bỏ score mới tạo vào và set list score này cho result
                                    List<ScoreGraduation> scoreGraduationList = new ArrayList<>();
                                    scoreGraduationList.add(scoreGraduation);
                                    existedResultGraduation.setScoreCouncil(scoreGraduationList);
                                    resultGraduationRepository.save(existedResultGraduation);
                                    //Tạo mới list result để gán cho subject
                                    List<ResultGraduation> resultGraduations = new ArrayList<>();
                                    resultGraduations.add(existedResultGraduation);
                                    existedSubject.setResultGraduations(resultGraduations);
                                    subjectRepository.save(existedSubject);
                                    existedLecturer.setScoreGraduationList(scoreGraduationList);
                                    lecturerRepository.save(existedLecturer);
                                    student3.setResultGraduation(existedResultGraduation);
                                    studentRepository.save(student3);
                                } else {
                                    //Trả về mã 302 - Thông báo đã chấm điểm
                                    return new ResponseEntity<>(HttpStatus.FOUND);
                                }
                            }
                        }
                    }

                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



    //GVHD chấm điểm KLTN
    private ResponseEntity<?> updateStudentScore(Subject existedSubject, String studentId, Double score) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return new ResponseEntity<>("Không tìm thấy sinh viên", HttpStatus.NOT_FOUND);
        }

        ResultGraduation existedResult = resultGraduationRepository.findResultGraduationByStudentAndSubject(student, existedSubject);
        if (existedResult != null) {
            existedResult.setScoreInstructor(score);
            resultGraduationRepository.save(existedResult);
        } else {
            ResultGraduation resultGraduation = new ResultGraduation();
            resultGraduation.setScoreInstructor(score);
            resultGraduation.setStudent(student);
            resultGraduation.setSubject(existedSubject);
            resultGraduationRepository.save(resultGraduation);

            // Add the new result to the subject's list of results
            if (existedSubject.getResultGraduations() == null) {
                existedSubject.setResultGraduations(new ArrayList<>());
            }
            existedSubject.getResultGraduations().add(resultGraduation);
            subjectRepository.save(existedSubject);
        }
        return null; // Indicate success
    }

    public ResponseEntity<?> InstructorAddScoreGraduation(int id, String authorizationHeader,
                                                          Double scoreStudent1, Double scoreStudent2, Double scoreStudent3,
                                                          String studentId1, String studentId2, String studentId3) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (!personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") &&
                !personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Subject existedSubject = subjectRepository.findById(id).orElse(null);
        if (existedSubject == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Cập nhật điểm cho Student 1
        if (existedSubject.getStudent1() != null && studentId1.equals(existedSubject.getStudent1())) {
            Student student = studentRepository.findById(studentId1).orElse(null);
            ResponseEntity<?> response = updateStudentScore(existedSubject, studentId1, scoreStudent1);
            ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student,existedSubject);
            //Tìm ds điểm của kq đó
            List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
            int countScore = scoreGraduations.size();
            List<CouncilLecturer> councilLecturerByCouncil = councilLecturerRepository.getListCouncilLecturerByCouncil(existedSubject.getCouncil());
            int countLecturers = councilLecturerByCouncil.size();
            if (countScore==countLecturers && resultGraduation.getScoreInstructor()!=null){
                existedSubject.setActive((byte)9);
            }
            if (response != null) return response;
        }

        // Cập nhật điểm cho Student 2
        if (existedSubject.getStudent2() != null && studentId2.equals(existedSubject.getStudent2())) {
            ResponseEntity<?> response = updateStudentScore(existedSubject, studentId2, scoreStudent2);
            if (response != null) return response;
        }

        // Cập nhật điểm cho Student 3
        if (existedSubject.getStudent3() != null && studentId3.equals(existedSubject.getStudent3())) {
            ResponseEntity<?> response = updateStudentScore(existedSubject, studentId3, scoreStudent3);
            if (response != null) return response;
        }

        return new ResponseEntity<>(existedSubject, HttpStatus.OK);
    }

}
