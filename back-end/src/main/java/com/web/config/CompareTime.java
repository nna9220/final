package com.web.config;

import com.web.entity.*;

import java.sql.Date;
import java.sql.Time;
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
        LocalDateTime currentTime = LocalDateTime.now();
        return currentTime.isAfter(start) && currentTime.isBefore(end);
    }

    public static boolean isCurrentTimeInPeriodStudent(List<RegistrationPeriod> periodList) {
        LocalDateTime currentTime = LocalDateTime.now();

        for (RegistrationPeriod period : periodList) {
            LocalDateTime start = period.getRegistrationTimeStart();
            LocalDateTime end = period.getRegistrationTimeEnd();

            System.out.println("start: " + start);
            System.out.println("end: " + end);
            System.out.println("current: " + currentTime);

            if (isCurrentTimeInIntervalStudent(start, end)) {
                return true;
            }
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

    public static boolean isCurrentTimeInBrowseTimeHead(List<TimeBrowsOfHead> timeBrowsOfHeads){
        LocalDateTime currentTime = LocalDateTime.now();

        for (TimeBrowsOfHead timeBrowsOfHead : timeBrowsOfHeads) {
            if (timeBrowsOfHead != null) {
                LocalDateTime timeStart = timeBrowsOfHead.getTimeStart();
                LocalDateTime timeEnd = timeBrowsOfHead.getTimeEnd();

                // Kiểm tra nếu currentTime nằm trong khoảng thời gian của timeBrowsOfHead
                if (currentTime.isAfter(timeStart) && currentTime.isBefore(timeEnd)) {
                    System.out.println("Current time " + currentTime + " is within the interval " + timeStart + " - " + timeEnd);
                    return true;
                }
            }
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


    //Check time của a nằm sau time của b - Admin - Quản lý đợt đăng ký đề taì (Thời gian SV sau GV, Thời gian Duyệt sau ĐK - Dành cho LocalDateTime)
    public static boolean isStartAfter(List<TimeBrowsOfHead> timeBrowsOfHeads, LocalDateTime start) {

        for (TimeBrowsOfHead timeBrowsOfHead : timeBrowsOfHeads) {
            LocalDateTime endTimeBrows = timeBrowsOfHead.getTimeEnd();

            // So sánh start của RegistrationPeriod với end của từng TimeBrowsOfHead trong danh sách
            if (start.isAfter(endTimeBrows)) {
                return true; // Nếu startRegistration sau endTimeBrows của bất kỳ TimeBrowsOfHead nào, trả về true
            }
        }
        return false; // Nếu không có TimeBrowsOfHead nào mà startRegistration sau endTimeBrows, trả về false
    }


}
