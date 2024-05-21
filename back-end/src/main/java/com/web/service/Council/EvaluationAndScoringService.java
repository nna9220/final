package com.web.service.Council;

import com.web.config.CheckRole;
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
    private LecturerRepository lecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
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

    //Của GV trong hội đồng
    //Sau khi GVPB duyệt active =7
    //Get list hội đồng của GV tgia
    //Get detail 1 hội đồng (Đè tài-Ngày giờ phản biện-Giảng viên trong hội đồng)
    //Get detail đề tài phản biện của hội đồng (Thông tin đề tài - Tiêu chí đánh giá - Chấm điểm - Đánh giá)
    //Giảng viên đánh giá, chấm điểm cho từng sinh viên


    //Lấy ra danh sách đề tài phản biện của GV hiện tại, status = true, active=6, typeSubject
    public ResponseEntity<?> getListCouncilOfLecturer(String authorizationHeader, TypeSubject typeSubject) {
        try {
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);

            if (personCurrent == null || personCurrent.getAuthorities() == null) {
                return new ResponseEntity<>("Invalid person or authorities", HttpStatus.BAD_REQUEST);
            }

            String roleName = personCurrent.getAuthorities().getName();
            if ("ROLE_LECTURER".equals(roleName) || "ROLE_HEAD".equals(roleName)) {
                Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                if (existedLecturer == null) {
                    return new ResponseEntity<>("Lecturer not found", HttpStatus.NOT_FOUND);
                }

                List<Council> councils = councilRepository.getListCouncilByLecturer(existedLecturer);
                List<Council> councilResponse = new ArrayList<>();

                for (Council council : councils) {
                    Subject subject = council.getSubject();
                    if (subject != null && typeSubject.equals(subject.getTypeSubject())) {
                        if (subject.isStatus() && subject.getActive() == 6) {
                            councilResponse.add(council);
                        }
                    }
                }

                return new ResponseEntity<>(councilResponse, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //Chi tiết council -- get detail của subject từ council
    public ResponseEntity<Map<String,Object>> detailCouncil(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Council existedCouncil = councilRepository.findById(id).orElse(null);
            if (existedCouncil!=null){
                Map<String,Object> response = new HashMap<>();
                response.put("council", existedCouncil);
                response.put("listLecturer",existedCouncil.getLecturers());
                response.put("subject",existedCouncil.getSubject());
                response.put("criteria",existedCouncil.getSubject().getCriteria());
                return new ResponseEntity<>(response,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //GV chấm điểm cho từng sinh viên và đánh giá - TLCN - Hội đồng là GVHD và GVPB
    public ResponseEntity<?> evaluationAndScoringEssay(String authorizationHeader, int id,
                                                       String reviewStudent1, String reviewStudent2, String reviewStudent3,
                                                       Double scoreStudent1, Double scoreStudent2, Double scoreStudent3) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                //Kiểm tra xem có tồn tại SVTH k
                if (existedSubject.getStudent1()!=null){
                    //Tìm Sv
                    Student student1 = studentRepository.findById(existedSubject.getStudent1()).orElse(null);
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
                            resultEssayRepository.save(resultEssayStudent1);
                            student1.setResultEssay(resultEssayStudent1);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            if (existedResultEssay.getScoreThesis()!=null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent1);
                                existedResultEssay.setReviewThesis(reviewStudent1);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student1);
                                resultEssayRepository.save(existedResultEssay);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent1);
                                existedResultEssay.setReviewInstructor(reviewStudent1);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student1);
                                resultEssayRepository.save(existedResultEssay);
                            }
                        }
                    }
                }
                //student2
                if (existedSubject.getStudent2()!=null){
                    //Tìm Sv
                    Student student2 = studentRepository.findById(existedSubject.getStudent2()).orElse(null);
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
                            resultEssayRepository.save(resultEssayStudent2);
                            student2.setResultEssay(resultEssayStudent2);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            if (existedResultEssay.getScoreThesis()!=null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent2);
                                existedResultEssay.setReviewThesis(reviewStudent2);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student2);
                                resultEssayRepository.save(existedResultEssay);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent2);
                                existedResultEssay.setReviewInstructor(reviewStudent2);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student2);
                                resultEssayRepository.save(existedResultEssay);
                            }
                        }
                    }
                }

                //student3
                if (existedSubject.getStudent3()!=null){
                    //Tìm Sv
                    Student student3 = studentRepository.findById(existedSubject.getStudent3()).orElse(null);
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
                            resultEssayRepository.save(resultEssayStudent3);
                            student3.setResultEssay(resultEssayStudent3);
                        } else {
                            //Chỉnh sửa result có sẵn
                            //Check xem GVHD hay GVPB đã cho điểm
                            if (existedResultEssay.getScoreThesis()!=null){
                                //nếu là gvhd thì set cho gvpb
                                existedResultEssay.setScoreThesis(scoreStudent3);
                                existedResultEssay.setReviewThesis(reviewStudent3);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student3);
                                resultEssayRepository.save(existedResultEssay);
                            }else {
                                //nếu là gvpb thì set cho gvhd
                                existedResultEssay.setScoreInstructor(scoreStudent3);
                                existedResultEssay.setReviewInstructor(reviewStudent3);
                                existedResultEssay.setSubject(existedSubject);
                                existedResultEssay.setStudent(student3);
                                resultEssayRepository.save(existedResultEssay);
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
    }

   /* //đánh giá chấm điểm kltn

    public ResponseEntity<?> evaluationAndScoringGraduation(String authorizationHeader, int id,
                                                            String reviewStudent1, String reviewStudent2, String reviewStudent3,
                                                            Double scoreStudent1, Double scoreStudent2, Double scoreStudent3){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);

        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }*/
}
