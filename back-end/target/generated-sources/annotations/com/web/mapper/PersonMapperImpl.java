package com.web.mapper;

import com.web.dto.request.PersonRequest;
import com.web.dto.response.PersonResponse;
import com.web.entity.Comment;
import com.web.entity.Person;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-29T12:17:53+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.37.0.v20240206-1609, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class PersonMapperImpl implements PersonMapper {

    @Override
    public PersonResponse toResponse(Person person) {
        if ( person == null ) {
            return null;
        }

        PersonResponse personResponse = new PersonResponse();

        personResponse.setPersonId( person.getPersonId() );
        personResponse.setLastName( person.getLastName() );
        personResponse.setFirstName( person.getFirstName() );
        personResponse.setPhone( person.getPhone() );
        personResponse.setGender( person.isGender() );
        try {
            if ( person.getBirthDay() != null ) {
                personResponse.setBirthDay( new SimpleDateFormat().parse( person.getBirthDay() ) );
            }
        }
        catch ( ParseException e ) {
            throw new RuntimeException( e );
        }
        personResponse.setStatus( person.isStatus() );
        List<Comment> list = person.getComments();
        if ( list != null ) {
            personResponse.setComments( new ArrayList<Comment>( list ) );
        }
        personResponse.setImage( person.getImage() );
        personResponse.setUserName( person.getUsername() );
        personResponse.setAuthority( person.getAuthorities() );

        return personResponse;
    }

    @Override
    public List<PersonResponse> toPersonListDTO(List<Person> persons) {
        if ( persons == null ) {
            return null;
        }

        List<PersonResponse> list = new ArrayList<PersonResponse>( persons.size() );
        for ( Person person : persons ) {
            list.add( toResponse( person ) );
        }

        return list;
    }

    @Override
    public Person toEntity(PersonRequest personRequest) {
        if ( personRequest == null ) {
            return null;
        }

        Person person = new Person();

        if ( personRequest.getBirthDay() != null ) {
            person.setBirthDay( new SimpleDateFormat().format( personRequest.getBirthDay() ) );
        }
        List<Comment> list = personRequest.getComments();
        if ( list != null ) {
            person.setComments( new ArrayList<Comment>( list ) );
        }
        person.setEmail( personRequest.getEmail() );
        person.setFirstName( personRequest.getFirstName() );
        person.setGender( personRequest.isGender() );
        person.setImage( personRequest.getImage() );
        person.setLastName( personRequest.getLastName() );
        person.setPassword( personRequest.getPassword() );
        person.setPersonId( personRequest.getPersonId() );
        person.setPhone( personRequest.getPhone() );
        person.setStatus( personRequest.isStatus() );

        return person;
    }
}
