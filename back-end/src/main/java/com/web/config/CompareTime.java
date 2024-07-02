package com.web.config;

import com.web.entity.*;

import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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
            LocalDate currentDate = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime currentTime = LocalTime.parse(LocalTime.now().format(formatter));

            // Kiểm tra ngày hiện tại và thời gian hiện tại nằm trong khoảng thời gian của council
            if (currentDate.equals(council.getDate())) {
                System.out.println("Current date: " + currentDate);
                System.out.println("Current time: " + currentTime);
                System.out.println(" start: " + council.getStart());
                System.out.println(" end: " + council.getEnd());
                System.out.println("date: " + council.getDate());
                System.out.println("Check start: " +currentTime.isAfter(council.getStart()));
                System.out.println("Check end: " +currentTime.isBefore(council.getEnd()));
                return currentTime.isAfter(council.getStart()) && currentTime.isBefore(council.getEnd());
            }
        }
        return false;
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

    public static boolean isCurrentTimeOutsideReportSubmissionTimes(List<ReportSubmissionTime> reportSubmissionTimes) {
        LocalDateTime now = LocalDateTime.now();
        boolean isOutside = false;  // Assume current time is outside unless we find one that includes it

        for (ReportSubmissionTime reportSubmissionTime : reportSubmissionTimes) {
            if (now.isAfter(reportSubmissionTime.getReportTimeStart()) && now.isBefore(reportSubmissionTime.getReportTimeEnd())) {
                isOutside = true;  // Current time is within one of the time windows
                break;
            }
        }
        return isOutside;
    }

    public static boolean isCouncilTimeWithinAnyCouncilReportTime(List<CouncilReportTime> councilReportTimes) {
        LocalDateTime currentTime = LocalDateTime.now();
        for (CouncilReportTime councilReportTime : councilReportTimes) {
            LocalDateTime reportStart = councilReportTime.getReportTimeStart();
            LocalDateTime reportEnd = councilReportTime.getReportTimeEnd();

            if (currentTime.isAfter(reportStart) && currentTime.isBefore(reportEnd)) {
                return true;  // Thời gian của Council nằm trong khoảng thời gian của CouncilReportTime.
            }
        }
        return false;  // Thời gian của Council không nằm trong bất kỳ khoảng thời gian nào của CouncilReportTime.
    }

}
