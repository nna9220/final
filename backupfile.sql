-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: registertopic
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `authority`
--
USE registertopic;

DROP TABLE IF EXISTS `authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authority` (
                             `name` varchar(255) NOT NULL,
                             PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authority`
--

LOCK TABLES `authority` WRITE;
/*!40000 ALTER TABLE `authority` DISABLE KEYS */;
INSERT INTO `authority` VALUES ('ROLE_ADMIN'),('ROLE_GUEST'),('ROLE_HEAD'),('ROLE_LECTURER'),('ROLE_STUDENT');
/*!40000 ALTER TABLE `authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
                           `comment_id` int NOT NULL AUTO_INCREMENT,
                           `content` varchar(255) DEFAULT NULL,
                           `date_submit` datetime DEFAULT NULL,
                           `poster` varchar(255) DEFAULT NULL,
                           `task_id` int DEFAULT NULL,
                           PRIMARY KEY (`comment_id`),
                           KEY `FKfc34jy6dfju6h06j14xf3itqx` (`poster`),
                           KEY `FKfknte4fhjhet3l1802m1yqa50` (`task_id`),
                           CONSTRAINT `FKfc34jy6dfju6h06j14xf3itqx` FOREIGN KEY (`poster`) REFERENCES `person` (`person_id`),
                           CONSTRAINT `FKfknte4fhjhet3l1802m1yqa50` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (24,'Hello','2023-12-14 03:02:25','20110753',1),(25,'Chào','2023-12-14 03:10:13','20110753',1),(26,'mjsfsf','2023-12-14 03:12:07','20110753',1),(27,'Heloo Thùy Trang','2023-12-14 03:21:57','20110753',1),(28,'Hoàn thành task 1','2023-12-21 15:20:17','GV001',1),(29,'Cập nhật task ','2023-12-21 17:30:10','GV003',4);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
                        `file_id` int NOT NULL AUTO_INCREMENT,
                        `comment_id` int DEFAULT NULL,
                        `task_id` int DEFAULT NULL,
                        `name` varchar(255) DEFAULT NULL,
                        `url` varchar(255) DEFAULT NULL,
                        PRIMARY KEY (`file_id`),
                        KEY `FKfakp2597je9wtgnojlwmywqsb` (`comment_id`),
                        KEY `FKkl8espv0gf1wcu82gvj2lccbm` (`task_id`),
                        CONSTRAINT `FKfakp2597je9wtgnojlwmywqsb` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`),
                        CONSTRAINT `FKkl8espv0gf1wcu82gvj2lccbm` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (14,24,1,'z4915000250434_97626c1a6a6d1c14a15c76a4c82153fd.jpg','http://localhost:8080/api/student/comment/fileUpload/z4915000250434_97626c1a6a6d1c14a15c76a4c82153fd.jpg'),(15,27,1,'z4955681805854_67e2ebbcecfd350af017b65991fbfe95.jpg','http://localhost:8080/api/student/comment/fileUpload/z4955681805854_67e2ebbcecfd350af017b65991fbfe95.jpg');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturer`
--

DROP TABLE IF EXISTS `lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturer` (
                            `lecturer_id` varchar(255) NOT NULL,
                            `major` varchar(50) DEFAULT NULL,
                            `authority` varchar(255) DEFAULT NULL,
                            PRIMARY KEY (`lecturer_id`),
                            KEY `FKhdkhx8tan7mlso7785d0wid2v` (`authority`),
                            CONSTRAINT `FKhdkhx8tan7mlso7785d0wid2v` FOREIGN KEY (`authority`) REFERENCES `authority` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturer`
--

LOCK TABLES `lecturer` WRITE;
/*!40000 ALTER TABLE `lecturer` DISABLE KEYS */;
INSERT INTO `lecturer` VALUES ('GV001','CongNghePhanMem','ROLE_LECTURER'),('GV002','AnToanThongTin','ROLE_HEAD'),('GV003','CongNghePhanMem','ROLE_HEAD'),('linhle','CongNghePhanMem','ROLE_LECTURER');
/*!40000 ALTER TABLE `lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
                                `notification_id` int NOT NULL AUTO_INCREMENT,
                                `content` varchar(255) DEFAULT NULL,
                                `date_submit` datetime DEFAULT NULL,
                                `title` varchar(255) DEFAULT NULL,
                                PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
                          `person_id` varchar(255) NOT NULL,
                          `actived` bit(1) DEFAULT NULL,
                          `birth_day` varchar(255) DEFAULT NULL,
                          `email` varchar(255) DEFAULT NULL,
                          `first_name` varchar(255) DEFAULT NULL,
                          `gender` bit(1) DEFAULT NULL,
                          `image` varchar(255) DEFAULT NULL,
                          `last_name` varchar(255) DEFAULT NULL,
                          `password` varchar(255) DEFAULT NULL,
                          `phone` varchar(255) DEFAULT NULL,
                          `provider_id` varchar(255) DEFAULT NULL,
                          `status` bit(1) DEFAULT NULL,
                          `user_name` varchar(255) DEFAULT NULL,
                          `authority_name` varchar(255) DEFAULT NULL,
                          PRIMARY KEY (`person_id`),
                          KEY `FKh5l7pviaei0j6351nkb3qn7hc` (`authority_name`),
                          CONSTRAINT `FKh5l7pviaei0j6351nkb3qn7hc` FOREIGN KEY (`authority_name`) REFERENCES `authority` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('20110224',NULL,'16/02/2001',NULL,'Nguyễn Thanh',_binary '\0',NULL,'Phúc',NULL,'0358442521',NULL,_binary '','nguyenthuan20072bl@gmail.com','ROLE_STUDENT'),('20110225',NULL,'03/04/2001',NULL,'Nguyễn Thị Thanh',_binary '',NULL,'Ngân',NULL,'0357896542',NULL,_binary '','thanhngan@gmail.com','ROLE_STUDENT'),('20110315',_binary '','Fri Dec 13 00:00:00 ICT 2002',NULL,'Võ Hồng',_binary '',NULL,'Nho',NULL,'0357896541',NULL,_binary '','20110315@student.hcmute.edu.vn','ROLE_STUDENT'),('20110552',NULL,'03/04/2001',NULL,'Nguyễn Văn ',_binary '\0',NULL,'An',NULL,'0357896555',NULL,_binary '','anan@gmail.com','ROLE_STUDENT'),('20110658',NULL,'03/04/2001',NULL,'Võ Trương Duy',_binary '\0',NULL,'Dũng',NULL,'0358442521',NULL,_binary '','nholon0905@gmail.com','ROLE_STUDENT'),('20110678',_binary '','Fri Feb 22 00:00:00 ICT 2002',NULL,'Nguyễn Thị',_binary '',NULL,'Na',NULL,'0358954762',NULL,_binary '\0','20110678@student.hcmute.edu.vn','ROLE_STUDENT'),('20110753',_binary '','Tue Apr 03 00:00:00 ICT 2001',NULL,'Nguyễn Thị Thùy ',_binary '',NULL,'Trang',NULL,'0351248545',NULL,_binary '','20110753@student.hcmute.edu.vn','ROLE_STUDENT'),('877bca0e-4446-44eb-83e2-a773b3850eba',_binary '',NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,_binary '\0','phamthituoi251@gmail.com','ROLE_GUEST'),('AD001',_binary '','Tue Oct 22 00:00:00 ICT 1985',NULL,'Trần Minh',_binary '\0',NULL,'Anh',NULL,'0355539992',NULL,_binary '\0','minhanhit0304@gmail.com','ROLE_ADMIN'),('GV001',_binary '','Thu Oct 22 00:00:00 ICT 1987',NULL,'Nguyễn Hữu',_binary '\0',NULL,'Thành',NULL,'0342837833',NULL,_binary '\0','thuytrangh4chuyen@gmail.com','ROLE_LECTURER'),('GV002',_binary '','16/02/2001',NULL,'Huỳnh Nguyễn Anh',_binary '',NULL,'Thư',NULL,'0343998584',NULL,_binary '','nna9220@gmail.com','ROLE_HEAD'),('GV003',_binary '','Fri Jun 15 00:00:00 ICT 1990',NULL,'Nguyễn Thanh',_binary '\0',NULL,'Thuận',NULL,'035698587',NULL,_binary '\0','nguyenthuan2007bl@gmail.com','ROLE_HEAD'),('linhle',NULL,'03/04/1992',NULL,'Lê',_binary '',NULL,'Linh',NULL,'0357896541',NULL,_binary '','linhle941999@gmail.com','ROLE_LECTURER');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register_period`
--

DROP TABLE IF EXISTS `register_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register_period` (
                                   `period_id` int NOT NULL AUTO_INCREMENT,
                                   `registration_name` varchar(255) DEFAULT NULL,
                                   `registration_time_end` datetime DEFAULT NULL,
                                   `registration_time_start` datetime DEFAULT NULL,
                                   `type_subject_id` int DEFAULT NULL,
                                   PRIMARY KEY (`period_id`),
                                   KEY `FKf8orx2htsrpu0bx4tyqp4upql` (`type_subject_id`),
                                   CONSTRAINT `FKf8orx2htsrpu0bx4tyqp4upql` FOREIGN KEY (`type_subject_id`) REFERENCES `type_subject` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register_period`
--

LOCK TABLES `register_period` WRITE;
/*!40000 ALTER TABLE `register_period` DISABLE KEYS */;
INSERT INTO `register_period` VALUES (3,'Đợt 1','2023-12-01 20:11:25','2023-12-12 20:11:41',1),(4,'Đợt 2','2023-12-05 20:11:25','2023-12-19 20:11:41',1);
/*!40000 ALTER TABLE `register_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register_period_lecturer`
--

DROP TABLE IF EXISTS `register_period_lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register_period_lecturer` (
                                            `period_id` int NOT NULL AUTO_INCREMENT,
                                            `registration_name` varchar(255) DEFAULT NULL,
                                            `registration_time_end` datetime DEFAULT NULL,
                                            `registration_time_start` datetime DEFAULT NULL,
                                            PRIMARY KEY (`period_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register_period_lecturer`
--

LOCK TABLES `register_period_lecturer` WRITE;
/*!40000 ALTER TABLE `register_period_lecturer` DISABLE KEYS */;
INSERT INTO `register_period_lecturer` VALUES (1,'Đợt 1','2023-12-13 20:11:41','2023-12-17 20:11:41'),(2,'Đợt 2','2024-01-12 20:11:41','2025-06-12 20:11:41');
/*!40000 ALTER TABLE `register_period_lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
                         `role_id` bigint NOT NULL AUTO_INCREMENT,
                         `role_name` varchar(255) DEFAULT NULL,
                         PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_year`
--

DROP TABLE IF EXISTS `school_year`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_year` (
                               `year_id` int NOT NULL AUTO_INCREMENT,
                               `year` varchar(50) DEFAULT NULL,
                               PRIMARY KEY (`year_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_year`
--

LOCK TABLES `school_year` WRITE;
/*!40000 ALTER TABLE `school_year` DISABLE KEYS */;
INSERT INTO `school_year` VALUES (1,'2018-2022'),(2,'2019-2023'),(3,'2020-2024'),(4,'2021-2025'),(5,'2022-2026'),(6,'2023-2027'),(7,'2020-2024');
/*!40000 ALTER TABLE `school_year` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
                           `student_id` varchar(255) NOT NULL,
                           `major` varchar(50) DEFAULT NULL,
                           `year_id` int DEFAULT NULL,
                           `class_id` int DEFAULT NULL,
                           `subject_id` int DEFAULT NULL,
                           PRIMARY KEY (`student_id`),
                           KEY `FK5uymh67120e0pktnyf7plid6w` (`year_id`),
                           KEY `FK6jmw3w31l9ojcckkrgv3ga7un` (`class_id`),
                           KEY `FKmyd718fb0oebjwr8siyift6gu` (`subject_id`),
                           CONSTRAINT `FK5uymh67120e0pktnyf7plid6w` FOREIGN KEY (`year_id`) REFERENCES `school_year` (`year_id`),
                           CONSTRAINT `FK6jmw3w31l9ojcckkrgv3ga7un` FOREIGN KEY (`class_id`) REFERENCES `student_class` (`id`),
                           CONSTRAINT `FKmyd718fb0oebjwr8siyift6gu` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('20110224','AnToanThongTin',3,1,NULL),('20110225','AnToanThongTin',3,2,NULL),('20110315','CongNghePhanMem',3,1,4),('20110552','AnToanThongTin',3,2,NULL),('20110658','CongNghePhanMem',3,2,NULL),('20110678','CongNghePhanMem',2,2,4),('20110753','CongNghePhanMem',2,2,8);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_class`
--

DROP TABLE IF EXISTS `student_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_class` (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `classname` varchar(50) DEFAULT NULL,
                                 `status` bit(1) DEFAULT NULL,
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_class`
--

LOCK TABLES `student_class` WRITE;
/*!40000 ALTER TABLE `student_class` DISABLE KEYS */;
INSERT INTO `student_class` VALUES (1,'201101A',_binary ''),(2,'201102A',_binary ''),(3,'201102C',_binary '\0'),(4,'20110ST1',_binary ''),(5,'20110ST2',_binary '');
/*!40000 ALTER TABLE `student_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
                           `subject_id` int NOT NULL AUTO_INCREMENT,
                           `expected` varchar(255) DEFAULT NULL,
                           `major` varchar(50) DEFAULT NULL,
                           `requirement` varchar(255) DEFAULT NULL,
                           `review` varchar(255) DEFAULT NULL,
                           `score` double DEFAULT NULL,
                           `status` bit(1) DEFAULT NULL,
                           `student_1` varchar(255) DEFAULT NULL,
                           `student_2` varchar(255) DEFAULT NULL,
                           `subject_name` varchar(255) DEFAULT NULL,
                           `ÿear` varchar(255) DEFAULT NULL,
                           `instructor_id` varchar(255) DEFAULT NULL,
                           `thesis_advisor_id` varchar(255) DEFAULT NULL,
                           `type_id_subject` int DEFAULT NULL,
                           `active` tinyint DEFAULT NULL,
                           PRIMARY KEY (`subject_id`),
                           KEY `FKeodtsr2fw3wxvb7aob0yg7oy1` (`instructor_id`),
                           KEY `FK5ldgqo6j19rlbimbk02lavo2w` (`student_1`),
                           KEY `FKit8bvjmlff7fdltao8ijudvj7` (`student_2`),
                           KEY `FKm8x3egqit8xp3v27w9k9ovn4r` (`thesis_advisor_id`),
                           KEY `FKplu43ukiq1q567m37vno0e02g` (`type_id_subject`),
                           CONSTRAINT `FK5ldgqo6j19rlbimbk02lavo2w` FOREIGN KEY (`student_1`) REFERENCES `student` (`student_id`),
                           CONSTRAINT `FKeodtsr2fw3wxvb7aob0yg7oy1` FOREIGN KEY (`instructor_id`) REFERENCES `lecturer` (`lecturer_id`),
                           CONSTRAINT `FKit8bvjmlff7fdltao8ijudvj7` FOREIGN KEY (`student_2`) REFERENCES `student` (`student_id`),
                           CONSTRAINT `FKm8x3egqit8xp3v27w9k9ovn4r` FOREIGN KEY (`thesis_advisor_id`) REFERENCES `lecturer` (`lecturer_id`),
                           CONSTRAINT `FKplu43ukiq1q567m37vno0e02g` FOREIGN KEY (`type_id_subject`) REFERENCES `type_subject` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (4,'èe','CongNghePhanMem','Task 2',NULL,NULL,_binary '','20110678','20110315','Xây dựng app quản lý bệnh viện','2023-12-13','GV003','GV001',1,1),(6,'h','CongNghePhanMem','fdfef',NULL,NULL,_binary '',NULL,NULL,'Test','2023-12-13','GV003','GV002',1,1),(8,'không','CongNghePhanMem','không',NULL,NULL,_binary '','20110753',NULL,'Xây dựng app quản lý thời gian','2023-12-13','GV001','GV002',1,2),(9,'h','CongNghePhanMem','fdfef',NULL,NULL,_binary '',NULL,NULL,'Test','2023-12-13','GV003','GV001',1,2),(13,'khong','CongNghePhanMem','khong',NULL,NULL,_binary '',NULL,NULL,'Website hoc toeic','2024-01-02','GV001',NULL,1,1),(14,'Khong','CongNghePhanMem','Khong',NULL,NULL,_binary '\0',NULL,NULL,'Website QLDT','2024-01-02','GV001',NULL,1,1);
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
                        `task_id` int NOT NULL AUTO_INCREMENT,
                        `requirement` varchar(255) DEFAULT NULL,
                        `time_end` datetime DEFAULT NULL,
                        `time_start` datetime DEFAULT NULL,
                        `assign_to` varchar(255) DEFAULT NULL,
                        `instructor_id` varchar(255) DEFAULT NULL,
                        `subject_id` int DEFAULT NULL,
                        `create_by` varchar(255) DEFAULT NULL,
                        `status` varchar(255) DEFAULT NULL,
                        PRIMARY KEY (`task_id`),
                        KEY `FKi52htc463mk791mv4s7rav8m0` (`assign_to`),
                        KEY `FKa8erqgkdycwwrx5cib1487s19` (`instructor_id`),
                        KEY `FK5k22wv8pvap89p7wpo0ghs95g` (`subject_id`),
                        KEY `FK2dg06mnot91yxjuhcbvlwtc4j` (`create_by`),
                        CONSTRAINT `FK2dg06mnot91yxjuhcbvlwtc4j` FOREIGN KEY (`create_by`) REFERENCES `person` (`person_id`),
                        CONSTRAINT `FK5k22wv8pvap89p7wpo0ghs95g` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`),
                        CONSTRAINT `FKa8erqgkdycwwrx5cib1487s19` FOREIGN KEY (`instructor_id`) REFERENCES `lecturer` (`lecturer_id`),
                        CONSTRAINT `FKi52htc463mk791mv4s7rav8m0` FOREIGN KEY (`assign_to`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,'KPI 1','2024-03-12 00:00:00','2024-01-12 00:00:00','20110753','GV001',8,'20110753','MustDo'),(2,'KPI 2','2024-03-12 00:00:00','2024-01-12 00:00:00','20110753','GV001',8,'20110753','MustDo'),(3,'KPI 3','2024-03-12 00:00:00','2024-01-12 00:00:00','20110753','GV001',8,'20110753','MustDo'),(4,'Liên hệ thực tế','2024-08-12 00:00:00','2024-01-12 00:00:00','20110315','GV003',4,'20110678',NULL),(5,'Khảo sát thực tế đề tài - 2','2024-03-12 00:00:00','2024-01-12 00:00:00','20110753','GV001',8,'20110753','MustDo');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_subject`
--

DROP TABLE IF EXISTS `type_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_subject` (
                                `type_id` int NOT NULL AUTO_INCREMENT,
                                `type_name` varchar(255) DEFAULT NULL,
                                PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_subject`
--

LOCK TABLES `type_subject` WRITE;
/*!40000 ALTER TABLE `type_subject` DISABLE KEYS */;
INSERT INTO `type_subject` VALUES (1,'Tiểu luận chuyên ngành');
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

-- Dump completed on 2024-02-25 20:08:51
