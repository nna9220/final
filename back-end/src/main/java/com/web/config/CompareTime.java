package com.web.config;

import com.web.entity.*;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;

public class CompareTime {
    private static Date parseDateString(String dateString) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        return (Date) dateFormat.parse(dateString);
    }
    private static boolean isCurrentTimeInInterval(Date start, Date end) {
        Date currentTime = new Date(System.currentTimeMillis()); // Lấy thời gian hiện tại
        // So sánh thời gian hiện tại với thời gian bắt đầu và kết thúc
        return currentTime.before(end) && currentTime.after(start);

    }

    public static boolean isCurrentTimeInIntervalLecturer(LocalDateTime start, LocalDateTime end) {
        LocalDateTime current = LocalDateTime.now();
        return !current.isBefore(start) && !current.isAfter(end);
    }
    private static boolean isCurrentTimeInIntervalStudent(LocalDateTime start, LocalDateTime end) {
        LocalDateTime currentTime = LocalDateTime.now(); // Lấy thời gian hiện tại
        return currentTime.isAfter(start) && currentTime.isBefore(end);
    }

    public static boolean isCurrentTimeInPeriodStudent(List<RegistrationPeriod> periodList) {
        Date currentTime = new Date(System.currentTimeMillis());
        if (periodList.size() >= 2) {
            RegistrationPeriod period1 = periodList.get(0);
            LocalDateTime start1 = period1.getRegistrationTimeStart();
            LocalDateTime end1 = period1.getRegistrationTimeEnd();
            RegistrationPeriod period2 = periodList.get(1);
            LocalDateTime start2 = period2.getRegistrationTimeStart();
            LocalDateTime end2 = period2.getRegistrationTimeEnd();

            System.out.println("start 1: " + start1);
            System.out.println("end 1: " + end1);
            System.out.println("start 2: " + start2);
            System.out.println("end 2: " + end2);
            System.out.println("current: " + currentTime);

            return isCurrentTimeInIntervalStudent(start1, end1) || isCurrentTimeInIntervalStudent(start2, end2);
        }
        return false;
    }
    public static boolean isCurrentTimeInPeriodSLecturer(List<RegistrationPeriodLectuer> periodList) {
        Date currentTime = new Date(System.currentTimeMillis());
        if (periodList.size() >= 2) {
            RegistrationPeriodLectuer period1 = periodList.get(0);
            LocalDateTime start1 = period1.getRegistrationTimeStart();
            LocalDateTime end1 = period1.getRegistrationTimeEnd();
            RegistrationPeriodLectuer period2 = periodList.get(1);
            LocalDateTime start2 = period2.getRegistrationTimeStart();
            LocalDateTime end2 = period2.getRegistrationTimeEnd();
            System.out.println("start 1: " + start1);
            System.out.println("end 1: " + end1);
            System.out.println("start 2: " + start2);
            System.out.println("end 2: " + end2);
            System.out.println("current: " + currentTime);
            return isCurrentTimeInIntervalLecturer(start1, end1) || isCurrentTimeInIntervalLecturer(start2, end2);
        }
        return false;
    }

    public static boolean isCurrentTimeInBrowseTimeHead(TimeBrowsOfHead timeBrowsOfHead){
        Date currentTime = new Date(System.currentTimeMillis());
        if (timeBrowsOfHead!=null){
            System.out.println("start 1: " + timeBrowsOfHead.getTimeStart());
            System.out.println("end 1: " + timeBrowsOfHead.getTimeEnd());
            System.out.println("current: " + currentTime);
            return isCurrentTimeInIntervalStudent(timeBrowsOfHead.getTimeStart(), timeBrowsOfHead.getTimeEnd());
        }
        return false;
    }

    public static boolean isCurrentTimeInAddSubjectTimeHead(List<TimeAddSubjectOfHead> timeAddSubjectOfHead){
        Date currentTime = new Date(System.currentTimeMillis());
        if (timeAddSubjectOfHead != null) {
            for (TimeAddSubjectOfHead time : timeAddSubjectOfHead) {
                System.out.println("start 1: " + time.getTimeStart());
                System.out.println("end 1: " + time.getTimeEnd());
                System.out.println("current: " + currentTime);
                if (isCurrentTimeInIntervalStudent(time.getTimeStart(), time.getTimeEnd())) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean isCurrentTimeInCouncilTime(Council council) {
        if (council != null) {
            LocalDateTime currentTime = LocalDateTime.now(); // Lấy thời gian hiện tại

            // So sánh thời gian hiện tại với thời gian trong Council
            return currentTime.isAfter(council.getTimeReport()); // Trả về true nếu thời gian hiện tại sau thời gian trong Council
        }
        return false; // Trả về false nếu Council là null
    }




}
