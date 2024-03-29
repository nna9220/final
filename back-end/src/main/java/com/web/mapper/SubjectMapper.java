package com.web.mapper;

import com.web.entity.Subject;
import com.web.dto.request.SubjectRequest;
import com.web.dto.response.SubjectResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    SubjectResponse toResponse(Subject subject);

    List<SubjectResponse> toSubjectListDTO(List<Subject> subjects);

    Subject toEntity(SubjectRequest subjectRequest);
}
