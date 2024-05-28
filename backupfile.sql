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
drop database registerhcmute;
create database registerhcmute;
use registerhcmute;
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
INSERT INTO `person` VALUES ('nna9920',_binary '','01 VVN','12/12/2002','Nguyen Thi',_binary '\0',NULL,'Na',NULL,'0987654321',NULL,_binary '','nna9220@gmail.com','ROLE_ADMIN');
INSERT INTO `person` VALUES ('thuytrang',_binary '','01 VVN','12/12/2002','Nguyen Thi Thuy',_binary '\0',NULL,'Trang',NULL,'0987654321',NULL,_binary '','minhanhit0304@gmail.com','ROLE_ADMIN');
INSERT INTO `person` VALUES ('phunghuynh',_binary '','01 VVN','12/12/2002','Huỳnh Xuân',_binary '\1',NULL,'Phụng',NULL,'0987654321',NULL,_binary '','phunghx@gmail.com','ROLE_ADMIN');

/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `register_period`
--

LOCK TABLES `register_period` WRITE;
/*!40000 ALTER TABLE `register_period` DISABLE KEYS */;
INSERT INTO `register_period` VALUES (1,'Đợt 1','2024-05-05','2024-01-01',1),(2,'Đợt 2','2024-05-05','2024-01-01',1),(3,'Đợt 1','2024-05-05','2024-01-01',2),(4,'Đợt 2','2024-05-05','2024-01-01',2);
/*!40000 ALTER TABLE `register_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `register_period_lecturer`
--

LOCK TABLES `register_period_lecturer` WRITE;
/*!40000 ALTER TABLE `register_period_lecturer` DISABLE KEYS */;
INSERT INTO `register_period_lecturer` VALUES (1,'Đợt 1','2024-05-05','2024-01-01',1),(2,'Đợt 2','2024-05-05','2024-01-01',1),(3,'Đợt 1','2024-05-05','2024-01-01',2),(4,'Đợt 2','2024-05-05','2024-01-01',2);
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
/*!40000 ALTER TABLE `school_year` ENABLE KEYS */;
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
INSERT INTO `time_add_subject_of_head` VALUES (1,'2024-05-05','2024-01-01',1),(2,'2024-05-05','2024-01-01',2);
/*!40000 ALTER TABLE `time_add_subject_of_head` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `time_brows_of_head`
--

LOCK TABLES `time_brows_of_head` WRITE;
/*!40000 ALTER TABLE `time_brows_of_head` DISABLE KEYS */;
INSERT INTO `time_brows_of_head` VALUES (1,'2024-05-05','2024-01-01',1),(2,'2024-05-05','2024-01-01',2);
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

-- Dump completed on 2024-05-14 14:59:23
