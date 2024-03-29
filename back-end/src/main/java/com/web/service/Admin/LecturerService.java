package com.web.service.Admin;

import com.web.exception.NotFoundException;
import com.web.entity.Lecturer;
import com.web.mapper.LecturerMapper;
import com.web.dto.request.LecturerRequest;
import com.web.repository.LecturerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LecturerService {
    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private LecturerMapper lecturerMapper;

    private static final Logger logger = LoggerFactory.getLogger(LecturerService.class);
    private final String CLASS_NOT_FOUND = "Class not found";


    public List<Lecturer> getAllLec(){
        return lecturerRepository.findAllLec();
    }

    public Lecturer saveLecturer(LecturerRequest lecturerRequest){
        try {
            var lec = lecturerMapper.toEntity(lecturerRequest);
            return lecturerRepository.save(lec);
        } catch (Exception e) {
            // Xử lý exception nếu cần
            logger.error("Lỗi: ", e);
            return null;
        }
    }

    public Lecturer detail(String id){
        Lecturer existedLecturer = lecturerRepository.findById(id).orElse(null);
        if (existedLecturer!=null) {
            return existedLecturer;
        }else {
            throw new NotFoundException(CLASS_NOT_FOUND);
        }
    }
}
