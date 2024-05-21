package com.web.config;

import com.web.entity.RegistrationPeriod;
import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TimeAddSubjectOfHead;
import com.web.entity.TimeBrowsOfHead;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    public static boolean isCurrentTimeInPeriodStudent(List<RegistrationPeriod> periodList) {
        Date currentTime = new Date(System.currentTimeMillis());
        if (periodList.size() >= 2) {
            RegistrationPeriod period1 = periodList.get(0);
            Date start1 = period1.getRegistrationTimeStart();
            Date end1 = period1.getRegistrationTimeEnd();
            RegistrationPeriod period2 = periodList.get(1);
            Date start2 = period2.getRegistrationTimeStart();
            Date end2 = period2.getRegistrationTimeEnd();

            System.out.println("start 1: " + start1);
            System.out.println("end 1: " + end1);
            System.out.println("start 2: " + start2);
            System.out.println("end 2: " + end2);
            System.out.println("current: " + currentTime);

            return isCurrentTimeInInterval(start1, end1) || isCurrentTimeInInterval(start2, end2);
        }
        return false;
    }
    public static boolean isCurrentTimeInPeriodSLecturer(List<RegistrationPeriodLectuer> periodList) {
        Date currentTime = new Date(System.currentTimeMillis());
        if (periodList.size() >= 2) {
            RegistrationPeriodLectuer period1 = periodList.get(0);
            Date start1 = period1.getRegistrationTimeStart();
            Date end1 = period1.getRegistrationTimeEnd();
            RegistrationPeriodLectuer period2 = periodList.get(1);
            Date start2 = period2.getRegistrationTimeStart();
            Date end2 = period2.getRegistrationTimeEnd();
            System.out.println("start 1: " + start1);
            System.out.println("end 1: " + end1);
            System.out.println("start 2: " + start2);
            System.out.println("end 2: " + end2);
            System.out.println("current: " + currentTime);
            return isCurrentTimeInInterval(start1, end1) || isCurrentTimeInInterval(start2, end2);
        }
        return false;
    }

    public static boolean isCurrentTimeInBrowseTimeHead(TimeBrowsOfHead timeBrowsOfHead){
        Date currentTime = new Date(System.currentTimeMillis());
        if (timeBrowsOfHead!=null){
            System.out.println("start 1: " + timeBrowsOfHead.getTimeStart());
            System.out.println("end 1: " + timeBrowsOfHead.getTimeEnd());
            System.out.println("current: " + currentTime);
            return isCurrentTimeInInterval(timeBrowsOfHead.getTimeStart(), timeBrowsOfHead.getTimeEnd());
        }
        return false;
    }

    public static boolean isCurrentTimeInAddSubjectTimeHead(TimeAddSubjectOfHead timeAddSubjectOfHead){
        Date currentTime = new Date(System.currentTimeMillis());
        if (timeAddSubjectOfHead!=null){
            System.out.println("start 1: " + timeAddSubjectOfHead.getTimeStart());
            System.out.println("end 1: " + timeAddSubjectOfHead.getTimeEnd());
            System.out.println("current: " + currentTime);
            return isCurrentTimeInInterval(timeAddSubjectOfHead.getTimeStart(), timeAddSubjectOfHead.getTimeEnd());
        }
        return false;
    }



}
