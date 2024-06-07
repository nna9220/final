-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: registertopic
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `authority`
--
use dataregistertopic;

LOCK TABLES `authority` WRITE;
/*!40000 ALTER TABLE `authority` DISABLE KEYS */;
INSERT INTO `authority` VALUES ('ROLE_ADMIN'),('ROLE_GUEST'),('ROLE_HEAD'),('ROLE_LECTURER'),('ROLE_STUDENT');
/*!40000 ALTER TABLE `authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `council`
--

LOCK TABLES `council` WRITE;
/*!40000 ALTER TABLE `council` DISABLE KEYS */;
/*!40000 ALTER TABLE `council` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `council_lecturer`
--

LOCK TABLES `council_lecturer` WRITE;
/*!40000 ALTER TABLE `council_lecturer` DISABLE KEYS */;
/*!40000 ALTER TABLE `council_lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `evaluation_criteria`
--

LOCK TABLES `evaluation_criteria` WRITE;
/*!40000 ALTER TABLE `evaluation_criteria` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluation_criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lecturer`
--

LOCK TABLES `lecturer` WRITE;
/*!40000 ALTER TABLE `lecturer` DISABLE KEYS */;
INSERT INTO `lecturer` VALUES ('0024','CongNghePhanMem','ROLE_LECTURER'),('0133','CongNghePhanMem','ROLE_LECTURER'),('0309','CongNghePhanMem','ROLE_LECTURER'),('0562','CongNghePhanMem','ROLE_LECTURER'),('0623','KyThuatDuLieu','ROLE_HEAD'),('1138','MangVaAnNinhMang','ROLE_HEAD'),('132','CongNghePhanMem','ROLE_LECTURER'),('1352','HeThongThongTin','ROLE_LECTURER'),('2148','HeThongThongTin','ROLE_LECTURER'),('2149','HeThongThongTin','ROLE_HEAD'),('2150','CongNghePhanMem','ROLE_LECTURER'),('3952','CongNghePhanMem','ROLE_HEAD'),('3995','HeThongThongTin','ROLE_LECTURER'),('4124','MangVaAnNinhMang','ROLE_LECTURER'),('5029','MangVaAnNinhMang','ROLE_LECTURER'),('5030','CongNghePhanMem','ROLE_LECTURER'),('6036','CongNghePhanMem','ROLE_LECTURER'),('6078','CongNghePhanMem','ROLE_LECTURER'),('6143','CongNghePhanMem','ROLE_LECTURER'),('6252','HeThongThongTin','ROLE_LECTURER'),('6352','KyThuatDuLieu','ROLE_LECTURER'),('6953','CongNghePhanMem','ROLE_LECTURER'),('7070','KyThuatDuLieu','ROLE_LECTURER'),('9079','CongNghePhanMem','ROLE_LECTURER'),('9513','CongNghePhanMem','ROLE_LECTURER'),('9831','CongNghePhanMem','ROLE_LECTURER'),('9833','CongNghePhanMem','ROLE_LECTURER'),('9979','MangVaAnNinhMang','ROLE_LECTURER'),('phunghx','CongNghePhanMem','ROLE_LECTURER');
/*!40000 ALTER TABLE `lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('0024',NULL,'01 Vo Van Ngan','1990-12-10','Mai Tuấn',_binary '\0',NULL,'Khôi',NULL,'0947940815',NULL,_binary '','khoimt@hcmute.edu.vn','ROLE_LECTURER'),('0133',NULL,'01 Vo Van Ngan','1990-10-10','Lê Văn',_binary '\0',NULL,'Vinh',NULL,'0987654321',NULL,_binary '','vinhlv@hcmute.edu.vn','ROLE_LECTURER'),('0309',NULL,'01 Vo Van Ngan','1990-12-10','Quách Đình',_binary '\0',NULL,'Hoàng',NULL,'0947940815',NULL,_binary '','hoangqd@hcmute.edu.vn','ROLE_LECTURER'),('0562',NULL,'01 Vo Van Ngan','1990-10-10','Trương Thị Ngọc',_binary '',NULL,'Phượng',NULL,'0987654321',NULL,_binary '','phuongttn@hcmute.edu.vn','ROLE_LECTURER'),('0623',NULL,'01 Vo Van Ngan,01 Vo Van Ngan,01 Vo Van Ngan,01 Vo Van Ngan','1990-12-10','Trần Nhật',_binary '\0',NULL,'Quang',NULL,'0947940815',NULL,_binary '','quangtn@hcmute.edu.vn','ROLE_HEAD'),('1138',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Thị Thanh',_binary '',NULL,'Vân',NULL,'0947940815',NULL,_binary '','nttvan@hcmute.edu.vn','ROLE_HEAD'),('132',NULL,'01 Vo Van Ngan','1990-12-10','Lê Vĩnh',_binary '\0',NULL,'Thịnh',NULL,'0947940815',NULL,_binary '','thinhlv@hcmute.edu.vn','ROLE_LECTURER'),('1352',NULL,'01 Vo Van Ngan','1990-12-10','Võ Xuân',_binary '\0',NULL,'Thể',NULL,'0947940815',NULL,_binary '','thevx@hcmute.edu.vn','ROLE_LECTURER'),('2148',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Đăng',_binary '\0',NULL,'Quang',NULL,'0947940815',NULL,_binary '','quangnd@hcmute.edu.vn','ROLE_LECTURER'),('2149',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Thành',_binary '\0',NULL,'Sơn',NULL,'0947940815',NULL,_binary '','sonnt@hcmute.edu.vn','ROLE_HEAD'),('2150',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Minh',_binary '\0',NULL,'Đạo',NULL,'0947940815',NULL,_binary '','daonm@hcmute.edu.vn','ROLE_LECTURER'),('3952',NULL,'01 Vo Van Ngan','1990-12-10','Huỳnh Xuân',_binary '\0',NULL,'Phụng',NULL,'0947940815',NULL,_binary '','phunghx@hcmute.edu.vn','ROLE_HEAD'),('3995',NULL,'01 Vo Van Ngan','1990-10-10','Lê Thị Minh',_binary '',NULL,'Châu',NULL,'0987654321',NULL,_binary '','chaultm@hcmute.edu.vn','ROLE_LECTURER'),('4124',NULL,'01 Vo Van Ngan','1990-12-10','Huỳnh Nguyên',_binary '\0',NULL,'Chính',NULL,'0947940815',NULL,_binary '','chinhhn@hcmute.edu.vn','ROLE_LECTURER'),('5029',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Xuân',_binary '\0',NULL,'Sâm',NULL,'0947940815',NULL,_binary '','samnx@hcmute.edu.vn','ROLE_LECTURER'),('5030',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Thủy',_binary '',NULL,'An',NULL,'0947940815',NULL,_binary '','annt@hcmute.edu.vn','ROLE_LECTURER'),('6036',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Đức',_binary '\0',NULL,'Khoan',NULL,'0947940815',NULL,_binary '','khoannd@hcmute.edu.vn','ROLE_LECTURER'),('6078',NULL,'01 Vo Van Ngan','1990-10-10','Trương Thị Khánh',_binary '',NULL,'Dịp',NULL,'0987654321',NULL,_binary '','dipttk@hcmute.edu.vn','ROLE_LECTURER'),('6143',NULL,'01 Vo Van Ngan','1990-12-10','Hoàng Công',_binary '\0',NULL,'Trình',NULL,'0947940815',NULL,_binary '','trinhhc@hcmute.edu.vn','ROLE_LECTURER'),('6252',NULL,'01 Vo Van Ngan','1990-12-10','Nguyễn Văn',_binary '\0',NULL,'Thành',NULL,'0947940815',NULL,_binary '','thanhnv@hcmute.edu.vn','ROLE_LECTURER'),('6352',NULL,'01 Vo Van Ngan','1990-12-10','Lê Minh',_binary '\0',NULL,'Tân',NULL,'0947940815',NULL,_binary '','tanlm@hcmute.edu.vn','ROLE_LECTURER'),('6953',NULL,'01 Vo Van Ngan','1990-12-10','Ngô Ngọc Đăng',_binary '\0',NULL,'Khoa',NULL,'0947940815',NULL,_binary '','khoannd@hcmute.edu.vn','ROLE_LECTURER'),('7070',NULL,'01 Vo Van Ngan','1990-12-10','Trần Trọng',_binary '\0',NULL,'Bình',NULL,'0947940815',NULL,_binary '','binhtt@hcmute.edu.vn','ROLE_LECTURER'),('9079',NULL,'01 Vo Van Ngan','1990-12-10','Trần Tiến ',_binary '\0',NULL,'Đức',NULL,'0947940815',NULL,_binary '','ductt@hcmute.edu.vn','ROLE_LECTURER'),('9513',NULL,'01 Vo Van Ngan','1990-10-10','Nguyễn Trần Thi',_binary '\0',NULL,'Văn',NULL,'0987654321',NULL,_binary '','vanntt@hcmute.edu.vn','ROLE_LECTURER'),('9831',NULL,'01 Vo Van Ngan','1990-10-10','Hoàng Văn',_binary '\0',NULL,'Dũng',NULL,'0987654321',NULL,_binary '','dunghv@hcmute.edu.vn','ROLE_LECTURER'),('9833',NULL,'01 Vo Van Ngan','1990-12-10','Mai Anh',_binary '',NULL,'Thơ',NULL,'0947940815',NULL,_binary '','thoma@hcmute.edu.vn','ROLE_LECTURER'),('9979',NULL,'01 Vo Van Ngan','1990-12-10','Đinh Công',_binary '\0',NULL,'Đoan',NULL,'0947940815',NULL,_binary '','doandc@hcmute.edu.vn','ROLE_LECTURER'),('nna9920',_binary '','01 VVN','12/12/2002','Nguyen Thi',_binary '\0',NULL,'Na',NULL,'0987654321',NULL,_binary '','nna9220@gmail.com','ROLE_ADMIN'),('phunghuynh',_binary '','01 VVN','12/12/2002','Huỳnh Xuân',_binary '',NULL,'Phụng',NULL,'0987654321',NULL,_binary '','phunghx@gmail.com','ROLE_ADMIN'),('phunghx',NULL,'01 Vo Van Ngan','1990-12-10','Huỳnh Xuân',_binary '\0',NULL,'Phụng',NULL,'0947940815',NULL,_binary '','hxphung@gmail.com','ROLE_LECTURER'),('thuytrang',_binary '','01 VVN','12/12/2002','Nguyen Thi Thuy',_binary '\0',NULL,'Trang',NULL,'0987654321',NULL,_binary '','minhanhit0304@gmail.com','ROLE_ADMIN');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `register_period`
--

LOCK TABLES `register_period` WRITE;
/*!40000 ALTER TABLE `register_period` DISABLE KEYS */;
INSERT INTO `register_period` VALUES (1,'Đợt 1','2024-06-21 02:00:00','2023-12-07 02:00:00',1),(2,'Đợt 2','2024-09-25 02:00:00','2024-09-10 02:00:00',1),(3,'Đợt 1','2024-05-05 00:00:00','2024-01-01 00:00:00',2),(4,'Đợt 2','2024-05-05 00:00:00','2024-01-01 00:00:00',2);
/*!40000 ALTER TABLE `register_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `register_period_lecturer`
--

LOCK TABLES `register_period_lecturer` WRITE;
/*!40000 ALTER TABLE `register_period_lecturer` DISABLE KEYS */;
INSERT INTO `register_period_lecturer` VALUES (1,'Đợt 1','2024-05-04 00:00:00','2023-12-31 00:00:00',1),(2,'Đợt 2','2024-05-05 00:00:00','2024-01-01 00:00:00',1),(3,'Đợt 1','2024-05-05 00:00:00','2024-01-01 00:00:00',2),(4,'Đợt 2','2024-05-05 00:00:00','2024-01-01 00:00:00',2);
/*!40000 ALTER TABLE `register_period_lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `result_criteria`
--

LOCK TABLES `result_criteria` WRITE;
/*!40000 ALTER TABLE `result_criteria` DISABLE KEYS */;
/*!40000 ALTER TABLE `result_criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `result_essay`
--

LOCK TABLES `result_essay` WRITE;
/*!40000 ALTER TABLE `result_essay` DISABLE KEYS */;
/*!40000 ALTER TABLE `result_essay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `result_graduation`
--

LOCK TABLES `result_graduation` WRITE;
/*!40000 ALTER TABLE `result_graduation` DISABLE KEYS */;
/*!40000 ALTER TABLE `result_graduation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `school_year`
--

LOCK TABLES `school_year` WRITE;
/*!40000 ALTER TABLE `school_year` DISABLE KEYS */;
INSERT INTO `school_year` VALUES (1,'2020-2024'),(2,'2021-2025'),(3,'2019-2023'),(4,'2018-2022'),(5,'2017-2021'),(6,'2016-2020');
/*!40000 ALTER TABLE `school_year` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `score_graduation`
--

LOCK TABLES `score_graduation` WRITE;
/*!40000 ALTER TABLE `score_graduation` DISABLE KEYS */;
/*!40000 ALTER TABLE `score_graduation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `student_class`
--

LOCK TABLES `student_class` WRITE;
/*!40000 ALTER TABLE `student_class` DISABLE KEYS */;
INSERT INTO `student_class` VALUES (2,'20110ST5',_binary ''),(3,'20110CLC',_binary ''),(6,'19110ST1',_binary ''),(7,'18110ST1',_binary ''),(8,'17110ST1',_binary ''),(9,'20110ST1',_binary ''),(10,'19110CLC',_binary ''),(11,'16110CLC',_binary ''),(12,'18110CLC',_binary ''),(13,'17110CLC',_binary ''),(14,'20130ST1',_binary ''),(15,'19130ST1',_binary ''),(16,'17130ST1',_binary ''),(17,'20110ST2',_binary '');
/*!40000 ALTER TABLE `student_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subject_criteria`
--

LOCK TABLES `subject_criteria` WRITE;
/*!40000 ALTER TABLE `subject_criteria` DISABLE KEYS */;
/*!40000 ALTER TABLE `subject_criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `time_add_subject_of_head`
--

LOCK TABLES `time_add_subject_of_head` WRITE;
/*!40000 ALTER TABLE `time_add_subject_of_head` DISABLE KEYS */;
INSERT INTO `time_add_subject_of_head` VALUES (1,'2024-05-05 00:00:00','2024-01-01 00:00:00',1),(2,'2024-05-05 00:00:00','2024-01-01 00:00:00',2);
/*!40000 ALTER TABLE `time_add_subject_of_head` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `time_brows_of_head`
--

LOCK TABLES `time_brows_of_head` WRITE;
/*!40000 ALTER TABLE `time_brows_of_head` DISABLE KEYS */;
INSERT INTO `time_brows_of_head` VALUES (1,'2024-05-05 00:00:00','2024-01-01 00:00:00',1),(2,'2024-05-05 00:00:00','2024-01-01 00:00:00',2);
/*!40000 ALTER TABLE `time_brows_of_head` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `type_subject`
--

LOCK TABLES `type_subject` WRITE;
/*!40000 ALTER TABLE `type_subject` DISABLE KEYS */;
INSERT INTO `type_subject` VALUES (2,'Khóa luận tốt nghiệp'),(1,'Tiểu luận chuyên ngành');
/*!40000 ALTER TABLE `type_subject` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-05 19:36:44
