package com.web.mapper;

import com.web.entity.Lecturer;
import com.web.dto.request.LecturerRequest;
import com.web.dto.response.LecturerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LecturerMapper {
    @Mapping(source = "lecturer.lecturerId", target = "lecturerId")
    @Mapping(source = "lecturer.authority", target = "authority")
    @Mapping(source = "lecturer.major", target = "major")
    @Mapping(source = "lecturer.person", target = "person")
    @Mapping(source = "lecturer.listSubInstruct", target = "listSubInstruct")
    @Mapping(source = "lecturer.listSubCounterArgument", target = "listSubCounterArgument")
    @Mapping(source = "lecturer.tasks", target = "tasks")
    LecturerResponse toResponse(Lecturer lecturer);

    List<LecturerResponse> toLecturerListDTO(List<Lecturer> lecturers);

    Lecturer toEntity(LecturerRequest lecturerRequest);
}
