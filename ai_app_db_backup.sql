-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: ai_app_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `login_history`
--

DROP TABLE IF EXISTS `login_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `login_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_login` (`user_id`,`login_date`),
  CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_history`
--

LOCK TABLES `login_history` WRITE;
/*!40000 ALTER TABLE `login_history` DISABLE KEYS */;
INSERT INTO `login_history` VALUES (1,1,'2026-08-15'),(4,1,'2026-08-19'),(6,1,'2026-08-28'),(9,1,'2026-08-29'),(13,1,'2026-08-30'),(18,1,'2026-09-03'),(7,2,'2026-08-28'),(12,3,'2026-08-29');
/*!40000 ALTER TABLE `login_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `class_name` varchar(50) DEFAULT NULL,
  `board_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_subject` (`user_id`,`subject_name`,`class_name`,`board_name`),
  CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (2,1,'Mathematics','2026-08-30 06:49:20','Class 10','Maharashtra State Board'),(3,1,'Science','2026-08-30 06:49:20','Class 10','Maharashtra State Board'),(4,1,'History & Political Science','2026-08-30 06:49:20','Class 10','Maharashtra State Board'),(5,1,'Geography','2026-08-30 06:49:20','Class 10','Maharashtra State Board'),(6,1,'Science & Technology','2026-09-03 11:33:01','Class 9','Maharashtra State Board'),(11,1,'Mathematics','2026-09-03 11:59:42','Class 9','Maharashtra State Board'),(12,1,'History & Political Science','2026-09-03 11:59:42','Class 9','Maharashtra State Board'),(13,1,'Geography','2026-09-03 11:59:42','Class 9','Maharashtra State Board'),(14,1,'Mathematics','2026-09-03 12:00:09','Class 9','CBSE'),(15,1,'Science','2026-09-03 12:00:09','Class 9','CBSE'),(16,1,'Social Science','2026-09-03 12:00:09','Class 9','CBSE');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syllabus_topics`
--

DROP TABLE IF EXISTS `syllabus_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `syllabus_topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `topic_name` varchar(255) NOT NULL,
  `completed` tinyint(1) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_subject_topic` (`subject_id`,`topic_name`),
  CONSTRAINT `syllabus_topics_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus_topics`
--

LOCK TABLES `syllabus_topics` WRITE;
/*!40000 ALTER TABLE `syllabus_topics` DISABLE KEYS */;
INSERT INTO `syllabus_topics` VALUES (3,2,'Linear Equations in Two Variables',1,'2026-08-30 12:32:52','2026-08-30 06:49:20'),(4,2,'Quadratic Equations',1,'2026-08-30 12:32:53','2026-08-30 06:49:20'),(5,2,'Arithmetic Progression',1,'2026-08-30 12:32:57','2026-08-30 06:49:20'),(6,2,'Financial Planning',1,'2026-08-30 12:32:59','2026-08-30 06:49:20'),(7,2,'Probability',1,'2026-08-30 12:33:00','2026-08-30 06:49:20'),(8,2,'Statistics',0,NULL,'2026-08-30 06:49:20'),(9,2,'Similarity',1,'2026-08-30 12:33:04','2026-08-30 06:49:20'),(10,2,'Pythagoras Theorem',1,'2026-08-30 12:33:05','2026-08-30 06:49:20'),(11,2,'Circle',1,'2026-08-30 12:33:12','2026-08-30 06:49:20'),(12,2,'Geometric Constructions',0,NULL,'2026-08-30 06:49:20'),(13,2,'Coordinate Geometry',0,NULL,'2026-08-30 06:49:20'),(14,2,'Trigonometry',0,NULL,'2026-08-30 06:49:20'),(15,2,'Mensuration',0,NULL,'2026-08-30 06:49:20'),(16,3,'Gravitation',1,'2026-08-30 12:33:22','2026-08-30 06:49:20'),(17,3,'Periodic Classification of Elements',0,NULL,'2026-08-30 06:49:20'),(18,3,'Chemical Reactions and Equations',0,NULL,'2026-08-30 06:49:20'),(19,3,'Effects of Electric Current',0,NULL,'2026-08-30 06:49:20'),(20,3,'Heat',0,NULL,'2026-08-30 06:49:20'),(21,3,'Refraction of Light',0,NULL,'2026-08-30 06:49:20'),(22,3,'Lenses',0,NULL,'2026-08-30 06:49:20'),(23,3,'Metallurgy',0,NULL,'2026-08-30 06:49:20'),(24,3,'Carbon Compounds',0,NULL,'2026-08-30 06:49:20'),(25,3,'Space Missions',0,NULL,'2026-08-30 06:49:20'),(26,3,'Heredity and Evolution',0,NULL,'2026-08-30 06:49:20'),(27,3,'Life Processes in Living Organisms',0,NULL,'2026-08-30 06:49:20'),(28,3,'Environmental Management',0,NULL,'2026-08-30 06:49:20'),(29,3,'Towards Green Energy',0,NULL,'2026-08-30 06:49:20'),(30,3,'Animal Classification',0,NULL,'2026-08-30 06:49:20'),(31,3,'Introduction to Microbiology',0,NULL,'2026-08-30 06:49:20'),(32,3,'Cell Biology and Biotechnology',0,NULL,'2026-08-30 06:49:20'),(33,3,'Social Health',0,NULL,'2026-08-30 06:49:20'),(34,3,'Disaster Management',0,NULL,'2026-08-30 06:49:20'),(35,4,'Introduction to History',1,'2026-08-30 12:33:33','2026-08-30 06:49:20'),(36,4,'Historiography - Indian Tradition',1,'2026-08-30 12:33:34','2026-08-30 06:49:20'),(37,4,'Applied History',1,'2026-08-30 12:33:35','2026-08-30 06:49:20'),(38,4,'History of Indian Arts',0,NULL,'2026-08-30 06:49:20'),(39,4,'Mass Media and History',0,NULL,'2026-08-30 06:49:20'),(40,4,'Entertainment and History',0,NULL,'2026-08-30 06:49:20'),(41,4,'Sports and History',0,NULL,'2026-08-30 06:49:20'),(42,4,'Tourism and History',0,NULL,'2026-08-30 06:49:20'),(43,4,'Heritage Management',0,NULL,'2026-08-30 06:49:20'),(44,4,'Working of the Constitution',1,'2026-08-30 12:33:40','2026-08-30 06:49:20'),(45,4,'The Electoral Process',0,NULL,'2026-08-30 06:49:20'),(46,4,'Political Parties',0,NULL,'2026-08-30 06:49:20'),(47,4,'Social and Political Movements',0,NULL,'2026-08-30 06:49:20'),(48,4,'Challenges faced by Indian Democracy',0,NULL,'2026-08-30 06:49:20'),(49,5,'Field Visit',1,'2026-08-30 12:33:47','2026-08-30 06:49:20'),(50,5,'Location and Extent',1,'2026-08-30 12:33:49','2026-08-30 06:49:20'),(51,5,'Physiography and Drainage',0,NULL,'2026-08-30 06:49:20'),(52,5,'Climate',0,NULL,'2026-08-30 06:49:20'),(53,5,'Natural Vegetation and Wildlife',0,NULL,'2026-08-30 06:49:20'),(54,5,'Population',0,NULL,'2026-08-30 06:49:20'),(55,5,'Human Settlements',0,NULL,'2026-08-30 06:49:20'),(56,5,'Economy and Occupations',0,NULL,'2026-08-30 06:49:20'),(57,5,'Tourism, Transport and Communication',0,NULL,'2026-08-30 06:49:20'),(58,5,'Industrial Development',0,NULL,'2026-08-30 06:49:20'),(59,5,'Map Scale and Map Work',0,NULL,'2026-08-30 06:49:20'),(60,2,'Sets',0,NULL,'2026-09-03 11:33:01'),(61,2,'Real Numbers',0,NULL,'2026-09-03 11:33:01'),(62,2,'Polynomials',0,NULL,'2026-09-03 11:33:01'),(63,2,'Basic Algebraic Operations',0,NULL,'2026-09-03 11:33:01'),(64,2,'Lines and Angles',0,NULL,'2026-09-03 11:33:01'),(65,2,'Triangles',0,NULL,'2026-09-03 11:33:01'),(66,2,'Quadrilaterals',0,NULL,'2026-09-03 11:33:01'),(67,2,'Surface Area and Volume',0,NULL,'2026-09-03 11:33:01'),(68,2,'Heron\'s Formula',0,NULL,'2026-09-03 11:33:01'),(69,6,'Laws of Motion',0,NULL,'2026-09-03 11:33:01'),(70,6,'Work and Energy',0,NULL,'2026-09-03 11:33:01'),(71,6,'Current Electricity',0,NULL,'2026-09-03 11:33:01'),(72,6,'Measurement of Matter',0,NULL,'2026-09-03 11:33:01'),(73,6,'Acids, Bases and Salts',0,NULL,'2026-09-03 11:33:01'),(74,6,'Classification of Plants',0,NULL,'2026-09-03 11:33:01'),(75,6,'Energy Flow in an Ecosystem',0,NULL,'2026-09-03 11:33:01'),(76,6,'Useful and Harmful Microbes',0,NULL,'2026-09-03 11:33:01'),(77,6,'Environmental Management',0,NULL,'2026-09-03 11:33:01'),(78,6,'Life Processes in Living Organisms',0,NULL,'2026-09-03 11:33:01'),(79,6,'Heredity and Evolution',0,NULL,'2026-09-03 11:33:01'),(80,6,'Introduction to Biotechnology',0,NULL,'2026-09-03 11:33:01'),(81,6,'Observing Space',0,NULL,'2026-09-03 11:33:01'),(82,6,'The Universe',0,NULL,'2026-09-03 11:33:01'),(83,6,'Carbon: An Important Element',0,NULL,'2026-09-03 11:33:01'),(84,6,'Substances in Common Use',0,NULL,'2026-09-03 11:33:01'),(85,6,'Metals and Non-metals',0,NULL,'2026-09-03 11:33:01'),(86,6,'Sound',0,NULL,'2026-09-03 11:33:01'),(87,4,'Sources of History',0,NULL,'2026-09-03 11:33:01'),(88,4,'India in the Post-Independence Period',0,NULL,'2026-09-03 11:33:01'),(89,4,'India’s Internal Challenges',0,NULL,'2026-09-03 11:33:01'),(90,4,'Economic Development',0,NULL,'2026-09-03 11:33:01'),(91,4,'Education',0,NULL,'2026-09-03 11:33:01'),(92,4,'Women and Other Weaker Sections',0,NULL,'2026-09-03 11:33:01'),(93,4,'Changing Life',0,NULL,'2026-09-03 11:33:01'),(94,4,'Traditions of Knowledge',0,NULL,'2026-09-03 11:33:01'),(95,4,'Political Science – Introduction',0,NULL,'2026-09-03 11:33:01'),(96,4,'Challenges before Indian Democracy',0,NULL,'2026-09-03 11:33:01'),(97,5,'Distributional Maps',0,NULL,'2026-09-03 11:33:01'),(98,5,'Endogenetic Movements',0,NULL,'2026-09-03 11:33:01'),(99,5,'Exogenetic Processes Part 1',0,NULL,'2026-09-03 11:33:01'),(100,5,'Exogenetic Processes Part 2',0,NULL,'2026-09-03 11:33:01'),(101,5,'Precipitation',0,NULL,'2026-09-03 11:33:01'),(102,5,'Properties of Sea Water',0,NULL,'2026-09-03 11:33:01'),(103,5,'International Date Line',0,NULL,'2026-09-03 11:33:01'),(104,5,'Natural Vegetation',0,NULL,'2026-09-03 11:33:01'),(105,5,'Transport and Communication',0,NULL,'2026-09-03 11:33:01'),(106,5,'Urbanisation',0,NULL,'2026-09-03 11:33:01'),(107,11,'Sets',0,NULL,'2026-09-03 11:59:42'),(108,11,'Real Numbers',0,NULL,'2026-09-03 11:59:42'),(109,11,'Polynomials',0,NULL,'2026-09-03 11:59:42'),(110,11,'Basic Algebraic Operations',0,NULL,'2026-09-03 11:59:42'),(111,11,'Linear Equations in Two Variables',0,NULL,'2026-09-03 11:59:42'),(112,11,'Financial Planning',0,NULL,'2026-09-03 11:59:42'),(113,11,'Statistics',0,NULL,'2026-09-03 11:59:42'),(114,11,'Probability',0,NULL,'2026-09-03 11:59:42'),(115,11,'Lines and Angles',0,NULL,'2026-09-03 11:59:42'),(116,11,'Triangles',0,NULL,'2026-09-03 11:59:42'),(117,11,'Quadrilaterals',0,NULL,'2026-09-03 11:59:42'),(118,11,'Circle',0,NULL,'2026-09-03 11:59:42'),(119,11,'Coordinate Geometry',0,NULL,'2026-09-03 11:59:42'),(120,11,'Surface Area and Volume',0,NULL,'2026-09-03 11:59:42'),(121,11,'Heron\'s Formula',0,NULL,'2026-09-03 11:59:42'),(122,11,'Trigonometry',0,NULL,'2026-09-03 11:59:42'),(123,12,'Sources of History',0,NULL,'2026-09-03 11:59:42'),(124,12,'India in the Post-Independence Period',0,NULL,'2026-09-03 11:59:42'),(125,12,'India’s Internal Challenges',0,NULL,'2026-09-03 11:59:42'),(126,12,'Economic Development',0,NULL,'2026-09-03 11:59:42'),(127,12,'Education',0,NULL,'2026-09-03 11:59:42'),(128,12,'Women and Other Weaker Sections',0,NULL,'2026-09-03 11:59:42'),(129,12,'Changing Life',0,NULL,'2026-09-03 11:59:42'),(130,12,'Traditions of Knowledge',0,NULL,'2026-09-03 11:59:42'),(131,12,'Political Science – Introduction',0,NULL,'2026-09-03 11:59:42'),(132,12,'Political Parties',0,NULL,'2026-09-03 11:59:42'),(133,12,'Social and Political Movements',0,NULL,'2026-09-03 11:59:42'),(134,12,'Challenges before Indian Democracy',0,NULL,'2026-09-03 11:59:42'),(135,13,'Distributional Maps',0,NULL,'2026-09-03 11:59:42'),(136,13,'Endogenetic Movements',0,NULL,'2026-09-03 11:59:42'),(137,13,'Exogenetic Processes Part 1',0,NULL,'2026-09-03 11:59:42'),(138,13,'Exogenetic Processes Part 2',0,NULL,'2026-09-03 11:59:42'),(139,13,'Precipitation',0,NULL,'2026-09-03 11:59:42'),(140,13,'Properties of Sea Water',0,NULL,'2026-09-03 11:59:42'),(141,13,'International Date Line',0,NULL,'2026-09-03 11:59:42'),(142,13,'Natural Vegetation',0,NULL,'2026-09-03 11:59:42'),(143,13,'Population',0,NULL,'2026-09-03 11:59:42'),(144,13,'Human Settlements',0,NULL,'2026-09-03 11:59:42'),(145,13,'Economy and Occupations',0,NULL,'2026-09-03 11:59:42'),(146,13,'Transport and Communication',0,NULL,'2026-09-03 11:59:42'),(147,13,'Urbanisation',0,NULL,'2026-09-03 11:59:42'),(148,14,'Number Systems',0,NULL,'2026-09-03 12:00:09'),(149,14,'Polynomials',0,NULL,'2026-09-03 12:00:09'),(150,14,'Coordinate Geometry',0,NULL,'2026-09-03 12:00:09'),(151,14,'Linear Equations in Two Variables',0,NULL,'2026-09-03 12:00:09'),(152,14,'Introduction to Euclid\'s Geometry',0,NULL,'2026-09-03 12:00:09'),(153,14,'Lines and Angles',0,NULL,'2026-09-03 12:00:09'),(154,14,'Triangles',0,NULL,'2026-09-03 12:00:09'),(155,14,'Quadrilaterals',0,NULL,'2026-09-03 12:00:09'),(156,14,'Circles',0,NULL,'2026-09-03 12:00:09'),(157,14,'Heron\'s Formula',0,NULL,'2026-09-03 12:00:09'),(158,14,'Surface Areas and Volumes',0,NULL,'2026-09-03 12:00:09'),(159,14,'Statistics and Probability',0,NULL,'2026-09-03 12:00:09'),(160,15,'Matter – Its Nature and Behaviour',0,NULL,'2026-09-03 12:00:09'),(161,15,'Organization in Living World',0,NULL,'2026-09-03 12:00:09'),(162,15,'Motion, Force and Work',0,NULL,'2026-09-03 12:00:09'),(163,15,'Food Production',0,NULL,'2026-09-03 12:00:09'),(164,16,'India and the Contemporary World – I',0,NULL,'2026-09-03 12:00:09'),(165,16,'Democratic Politics – I',0,NULL,'2026-09-03 12:00:09'),(166,16,'Contemporary India – I',0,NULL,'2026-09-03 12:00:09'),(167,16,'Economics',0,NULL,'2026-09-03 12:00:09'),(168,16,'Disaster Management',0,NULL,'2026-09-03 12:00:09');
/*!40000 ALTER TABLE `syllabus_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_academic_profiles`
--

DROP TABLE IF EXISTS `user_academic_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_academic_profiles` (
  `user_id` int NOT NULL,
  `class_name` varchar(20) NOT NULL,
  `board_name` varchar(100) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_academic_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_academic_profiles`
--

LOCK TABLES `user_academic_profiles` WRITE;
/*!40000 ALTER TABLE `user_academic_profiles` DISABLE KEYS */;
INSERT INTO `user_academic_profiles` VALUES (1,'Class 10','Maharashtra State Board','2026-27');
/*!40000 ALTER TABLE `user_academic_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'krishna','$2b$10$/ryUEbPK7kH5Bul6.DquqeTt4mLi1CkyIGtcyTaKk6LR8Bda1xOhW','2026-08-15 03:55:33'),(2,'Krrish','$2b$10$XpiBAp8cuHDGnTYBKCACpuna5jqfWrg7IivFdh2YXh.oijT.R2qLm','2026-08-28 07:37:48'),(3,'Rahul','$2b$10$cJR3eI2b5qXDiIVcSsQz0.lFlQbDb5h6tBQoZzDaZwtIeLmh7IZLK','2026-08-29 08:38:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 18:54:43
