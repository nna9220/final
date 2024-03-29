package com.web.service;

import com.web.entity.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl {
    @Autowired
    private JavaMailSender mailSender;

    @Value("$(RegisterTopic)")
    private String fromMail;
    public void sendMail(String mailStudent, String emailLecturer, String subject, String messenger){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);
        if (mailStudent!=null) {
            simpleMailMessage.setTo(emailLecturer, mailStudent);
        }else {
            simpleMailMessage.setTo(emailLecturer);
        }
        mailSender.send(simpleMailMessage);
    }


    public void sendMailStudents(String mailStudent, String mailStudent2, String subject, String messenger){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);
        simpleMailMessage.setTo(mailStudent, mailStudent2);
        mailSender.send(simpleMailMessage);
    }

    public void sendMailStudent(String mailStudent, String subject, String messenger){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);
        simpleMailMessage.setTo(mailStudent);
        mailSender.send(simpleMailMessage);
    }


    public void sendMailNull(String emailLecturer, String subject, String messenger){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);
        simpleMailMessage.setTo(emailLecturer);

        mailSender.send(simpleMailMessage);
    }
}
