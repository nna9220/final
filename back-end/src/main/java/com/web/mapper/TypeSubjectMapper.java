package com.web.mapper;

import com.web.entity.TypeSubject;
import com.web.dto.request.TypeSubjectRequest;
import com.web.dto.response.TypeSubjectResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeSubjectMapper {
    TypeSubjectResponse toResponse(TypeSubject typeSubject);

    List<TypeSubjectResponse> toTypeSubjectListDTO(List<TypeSubject> typeSubjects);

    TypeSubject toEntity(TypeSubjectRequest typeSubjectRequest);
}
