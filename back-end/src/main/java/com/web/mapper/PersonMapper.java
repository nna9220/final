package com.web.mapper;

import com.web.entity.Person;
import com.web.dto.request.PersonRequest;
import com.web.dto.response.PersonResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    @Mapping(source = "person.personId", target = "personId")
    @Mapping(source = "person.lastName", target = "lastName")
    @Mapping(source = "person.firstName", target = "firstName")
    //@Mapping(source = "person.user_Name", target = "userName")
    @Mapping(source = "person.phone", target = "phone")
    @Mapping(source = "person.gender", target = "gender")
    //@Mapping(source = "person.authority_name", target = "authority")
    @Mapping(source = "person.birthDay", target = "birthDay")
    @Mapping(source = "person.status", target = "status")
    @Mapping(source = "person.comments", target = "comments")
    @Mapping(source = "person.image", target = "image")
    @Mapping(source = "person.username", target = "userName")
    @Mapping(source = "person.authorities", target = "authority")
    PersonResponse toResponse(Person person);

    List<PersonResponse> toPersonListDTO(List<Person> persons);

    Person toEntity(PersonRequest personRequest);
}
