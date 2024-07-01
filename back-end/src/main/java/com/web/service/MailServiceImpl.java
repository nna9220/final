package com.web.service;

import com.web.entity.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import java.util.List;

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


    public void sendMailToStudents(List<String> studentEmails, String subject, String messenger) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);

        // Set các địa chỉ email của sinh viên
        simpleMailMessage.setTo(studentEmails.toArray(new String[0]));

        mailSender.send(simpleMailMessage);
    }

    public void sendMailToLecturers(List<String> lecturerEmails, String subject, String messenger) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromMail);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(messenger);
        // Set các địa chỉ email của giáo viên
        simpleMailMessage.setTo(lecturerEmails.toArray(new String[0]));
        mailSender.send(simpleMailMessage);
    }

    public void sendMailToPerson(List<String> personEmails, String subject, String messenger) {
        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(fromMail);
            simpleMailMessage.setSubject(subject);
            simpleMailMessage.setText(messenger);
            // Set các địa chỉ email của những người muốn gửi mail
            simpleMailMessage.setTo(personEmails.toArray(new String[0]));
            mailSender.send(simpleMailMessage);
        }catch (Exception e){
            System.out.println("Lỗi: " + e);
        }
    }


    public void sendMailWithAttachment(List<String> to, String subject, String text, String pathToAttachment) {
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setSubject(subject);
            messageHelper.setText(text);
            messageHelper.setTo(to.toArray(new String[0]));

            FileSystemResource file = new FileSystemResource(pathToAttachment);
            messageHelper.addAttachment(file.getFilename(), file);
        };
        mailSender.send(preparator);
    }
}
