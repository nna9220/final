package com.web.service.Admin;

import com.web.entity.TypeSubject;
import com.web.mapper.TypeSubjectMapper;
import com.web.dto.request.TypeSubjectRequest;
import com.web.repository.TypeSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeSubjectService {
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private TypeSubjectMapper typeSubjectMapper;

    public List<TypeSubject> findAll(){
        return typeSubjectRepository.getAllTypeSubject();
    }
    public TypeSubject createTypeSubject(TypeSubjectRequest typeSubjectRequest){
        var typeSubject = typeSubjectMapper.toEntity(typeSubjectRequest);
        return typeSubjectRepository.save(typeSubject);
    }
    public TypeSubject editTypeSubject(TypeSubject typeSubject){
        return typeSubjectRepository.save(typeSubject);
    }
}
