package com.web.service.Admin;

import com.web.entity.SchoolYear;
import com.web.mapper.SchoolYearMapper;
import com.web.dto.request.SchoolYearRequest;
import com.web.repository.SchoolYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolYearService {
    @Autowired
    private SchoolYearRepository schoolYearRepository;
    @Autowired
    private SchoolYearMapper schoolYearMapper;

    public List<SchoolYear> findAll(){
        return schoolYearRepository.getAllSchoolYear();
    }
    public SchoolYear createSchoolYear(SchoolYearRequest schoolYearRequest){
        var schoolYear =schoolYearMapper.toEntity(schoolYearRequest);
        return schoolYearRepository.save(schoolYear);
    }

    public SchoolYear editSchoolYear(SchoolYear schoolYear){
        return schoolYearRepository.save(schoolYear);
    }
}
