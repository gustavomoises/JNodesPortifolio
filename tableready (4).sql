-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2020 at 06:45 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tableready`
--

-- --------------------------------------------------------

--
-- Table structure for table `clustertables`
--

CREATE TABLE `clustertables` (
  `tableId` int(11) NOT NULL,
  `clusterId` int(11) NOT NULL,
  `tableX` int(100) DEFAULT NULL,
  `tableY` int(100) DEFAULT NULL,
  `tableLayoutSeatNumber` int(11) NOT NULL,
  `restaurantArea` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clustertables`
--

INSERT INTO `clustertables` (`tableId`, `clusterId`, `tableX`, `tableY`, `tableLayoutSeatNumber`, `restaurantArea`) VALUES
(7, 1, 105, 169, 6, 'A'),
(8, 2, 230, 165, 4, 'B'),
(9, 3, 390, 165, 2, 'B'),
(10, 4, 232, 336, 2, 'C'),
(11, 5, 320, 336, 2, 'C'),
(12, 6, 410, 336, 2, 'C'),
(8, 7, 230, 165, 4, 'B'),
(9, 7, 390, 165, 2, 'B'),
(10, 8, 232, 336, 2, 'C'),
(11, 8, 320, 336, 2, 'C'),
(11, 9, 320, 336, 2, 'C'),
(12, 9, 410, 336, 2, 'C'),
(10, 10, 232, 336, 2, 'C'),
(11, 10, 320, 336, 2, 'C'),
(12, 10, 410, 336, 2, 'C');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerId` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerId`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

-- --------------------------------------------------------

--
-- Table structure for table `layoutclusters`
--

CREATE TABLE `layoutclusters` (
  `clusterId` int(11) NOT NULL,
  `layoutId` int(11) NOT NULL,
  `clusterName` varchar(20) DEFAULT NULL,
  `clusterPriority` int(11) DEFAULT NULL,
  `clusterX` int(11) DEFAULT NULL,
  `clusterY` int(11) DEFAULT NULL,
  `clusterImage` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `layoutclusters`
--

INSERT INTO `layoutclusters` (`clusterId`, `layoutId`, `clusterName`, `clusterPriority`, `clusterX`, `clusterY`, `clusterImage`) VALUES
(1, 5, 'A[6]', 1, 105, 169, 'A_6_blue'),
(2, 5, 'B[4]', 4, 230, 165, 'B_4_blue'),
(3, 5, 'B[2]', 7, 390, 165, 'B_2_blue'),
(4, 5, 'C1[2]', 9, 232, 336, 'C_1_blue'),
(5, 5, 'C2[2]', 11, 320, 336, 'C_2_blue'),
(6, 5, 'C3[2]', 8, 410, 336, 'C_3_blue'),
(7, 5, 'B4-B2', 2, 218, 155, 'B_4_B_2'),
(8, 5, 'C1-C2', 6, 225, 329, 'C_1_C_2'),
(9, 5, 'C2-C3', 5, 313, 329, 'C_2_C_3'),
(10, 5, 'C1-C2-C3', 3, 225, 329, 'C1_C2_C3');

-- --------------------------------------------------------

--
-- Table structure for table `layouts`
--

CREATE TABLE `layouts` (
  `layoutId` int(11) NOT NULL COMMENT 'Define Restaurant Layout Id',
  `restaurantId` int(100) NOT NULL,
  `layoutName` varchar(20) NOT NULL COMMENT 'Define Restaurant Layout Name',
  `layoutImage` varchar(200) DEFAULT NULL COMMENT 'File location of the restaurant layout image'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `layouts`
--

INSERT INTO `layouts` (`layoutId`, `restaurantId`, `layoutName`, `layoutImage`) VALUES
(5, 1, 'Layout_0', 'layout'),
(6, 1, 'Jessy_layout', 'c:/SAIT/image/layout_round_table.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `reservationentries`
--

CREATE TABLE `reservationentries` (
  `reservationId` int(100) NOT NULL,
  `customerId` int(100) NOT NULL,
  `restaurantId` int(100) NOT NULL,
  `reservationPartySize` int(11) NOT NULL,
  `reservationStatus` varchar(20) NOT NULL,
  `reservationOrigin` varchar(20) NOT NULL,
  `creationDateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `reservationDateTime` datetime NOT NULL,
  `checkinDateTime` datetime DEFAULT NULL,
  `seatingDateTime` datetime DEFAULT NULL,
  `checkoutDateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reservationentries`
--

INSERT INTO `reservationentries` (`reservationId`, `customerId`, `restaurantId`, `reservationPartySize`, `reservationStatus`, `reservationOrigin`, `creationDateTime`, `reservationDateTime`, `checkinDateTime`, `seatingDateTime`, `checkoutDateTime`) VALUES
(9, 1, 1, 6, 'confirmed', 'email', '2020-06-08 08:00:00', '2020-06-18 08:00:00', NULL, NULL, NULL),
(10, 2, 1, 3, 'confirmed', 'phone', '2020-06-08 14:30:00', '2020-06-18 08:10:00', NULL, NULL, NULL),
(11, 3, 1, 4, 'confirmed', 'app', '2020-06-11 17:14:09', '2020-06-18 08:30:00', NULL, NULL, NULL),
(15, 10, 1, 5, 'confirmed', 'phone', '2020-06-11 17:18:21', '2020-06-18 08:45:00', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reservationentrytables`
--

CREATE TABLE `reservationentrytables` (
  `reservationId` int(100) NOT NULL,
  `tableId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `RestaurantId` int(100) NOT NULL,
  `layoutActive` int(11) DEFAULT NULL COMMENT 'Active Layout in the restaurant'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`RestaurantId`, `layoutActive`) VALUES
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL),
(1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tableavailability`
--

CREATE TABLE `tableavailability` (
  `tableId` int(11) NOT NULL COMMENT 'Table Id',
  `dateTime` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Date Time',
  `tableAvailabilityStatus` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Show if Table is available',
  `tableCheckoutStatus` tinyint(1) DEFAULT 0 COMMENT 'Show if client requested checkou',
  `tableCleaningStatus` tinyint(1) DEFAULT 0 COMMENT 'Show if table is under cleaning process',
  `clusterId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tableavailability`
--

INSERT INTO `tableavailability` (`tableId`, `dateTime`, `tableAvailabilityStatus`, `tableCheckoutStatus`, `tableCleaningStatus`, `clusterId`) VALUES
(7, '2020-06-16 20:37:35', 1, 0, 0, 1),
(7, '2020-06-16 20:54:20', 0, 0, 0, 1),
(7, '2020-06-16 21:17:26', 1, 0, 0, 1),
(7, '2020-06-16 21:25:47', 0, 0, 0, 1),
(7, '2020-06-16 21:28:40', 1, 0, 0, 1),
(7, '2020-06-16 21:29:38', 0, 0, 0, 1),
(7, '2020-06-16 21:57:00', 1, 0, 0, 1),
(7, '2020-06-16 21:59:43', 0, 0, 0, 1),
(7, '2020-06-16 22:03:10', 1, 0, 0, 1),
(7, '2020-06-16 22:05:39', 0, 0, 0, 1),
(7, '2020-06-16 22:07:19', 0, 1, 0, 1),
(7, '2020-06-16 22:08:02', 1, 0, 0, 1),
(7, '2020-06-16 22:09:06', 0, 0, 0, 1),
(7, '2020-06-17 10:24:27', 1, 0, 0, 1),
(7, '2020-06-17 14:21:37', 0, 0, 0, 1),
(7, '2020-06-17 14:23:37', 1, 0, 0, 1),
(7, '2020-06-17 14:26:39', 0, 0, 0, 1),
(7, '2020-06-17 14:30:17', 0, 1, 0, 1),
(7, '2020-06-17 14:30:51', 1, 0, 0, 1),
(7, '2020-06-17 14:33:58', 0, 0, 0, 1),
(7, '2020-06-17 14:37:43', 1, 0, 0, 1),
(7, '2020-06-17 15:02:08', 0, 0, 0, 1),
(7, '2020-06-17 15:06:06', 1, 0, 0, 1),
(7, '2020-06-18 08:00:40', 0, 1, 0, 1),
(7, '2020-06-18 08:02:44', 1, 0, 0, 1),
(7, '2020-06-18 08:07:17', 0, 0, 0, 1),
(7, '2020-06-18 08:08:47', 1, 0, 0, 1),
(7, '2020-06-18 08:20:14', 0, 0, 0, 1),
(7, '2020-06-18 08:21:34', 1, 0, 0, 1),
(7, '2020-06-18 08:23:26', 0, 0, 0, 1),
(7, '2020-06-18 08:24:32', 1, 0, 0, 1),
(7, '2020-06-18 08:25:45', 0, 0, 0, 1),
(7, '2020-06-18 08:26:36', 1, 0, 0, 1),
(7, '2020-06-18 08:47:20', 0, 0, 0, 1),
(7, '2020-06-18 08:49:58', 1, 0, 0, 1),
(7, '2020-06-18 08:51:49', 0, 0, 0, 1),
(7, '2020-06-18 08:52:43', 1, 0, 0, 1),
(8, '2020-06-16 20:37:46', 1, 0, 0, 2),
(8, '2020-06-16 20:53:19', 0, 0, 0, 2),
(8, '2020-06-16 21:17:31', 1, 0, 0, 2),
(8, '2020-06-16 21:24:47', 0, 0, 0, 7),
(8, '2020-06-16 21:30:23', 0, 1, 0, 7),
(8, '2020-06-16 21:32:31', 1, 0, 0, 2),
(8, '2020-06-16 21:57:55', 0, 0, 0, 2),
(8, '2020-06-16 22:03:16', 1, 0, 0, 2),
(8, '2020-06-16 22:05:52', 0, 0, 0, 2),
(8, '2020-06-16 22:07:30', 0, 0, 1, 2),
(8, '2020-06-16 22:08:06', 1, 0, 0, 2),
(8, '2020-06-16 22:09:16', 0, 0, 0, 2),
(8, '2020-06-17 14:02:16', 1, 0, 0, 2),
(8, '2020-06-17 14:02:47', 1, 0, 0, 2),
(8, '2020-06-17 14:02:49', 1, 0, 0, 2),
(8, '2020-06-17 14:20:59', 0, 0, 0, 2),
(8, '2020-06-17 14:24:07', 0, 1, 0, 2),
(8, '2020-06-17 14:25:22', 1, 0, 0, 2),
(8, '2020-06-17 14:26:55', 0, 0, 0, 2),
(8, '2020-06-17 14:27:50', 1, 0, 0, 2),
(8, '2020-06-17 14:29:10', 0, 0, 0, 7),
(8, '2020-06-17 14:37:52', 1, 0, 0, 2),
(8, '2020-06-17 15:01:04', 0, 0, 0, 2),
(8, '2020-06-17 15:06:30', 1, 0, 0, 2),
(8, '2020-06-18 08:07:28', 0, 0, 0, 2),
(8, '2020-06-18 08:09:07', 0, 1, 0, 2),
(8, '2020-06-18 08:13:27', 1, 0, 0, 2),
(8, '2020-06-18 08:20:31', 0, 0, 0, 2),
(8, '2020-06-18 08:21:44', 0, 1, 0, 2),
(8, '2020-06-18 08:22:18', 1, 0, 0, 2),
(8, '2020-06-18 08:23:39', 0, 0, 0, 2),
(8, '2020-06-18 08:24:39', 1, 0, 0, 2),
(8, '2020-06-18 08:25:55', 0, 0, 0, 7),
(8, '2020-06-18 08:26:42', 1, 0, 0, 2),
(8, '2020-06-18 08:47:49', 0, 0, 0, 2),
(8, '2020-06-18 08:50:14', 0, 1, 0, 2),
(8, '2020-06-18 08:51:19', 1, 0, 0, 2),
(8, '2020-06-18 08:52:03', 0, 0, 0, 2),
(8, '2020-06-18 08:52:50', 1, 0, 0, 2),
(9, '2020-06-16 20:37:56', 1, 0, 0, 3),
(9, '2020-06-16 20:54:41', 0, 0, 0, 3),
(9, '2020-06-16 21:17:36', 1, 0, 0, 3),
(9, '2020-06-16 21:24:47', 0, 0, 0, 7),
(9, '2020-06-16 21:30:31', 0, 1, 0, 7),
(9, '2020-06-16 21:32:36', 1, 0, 0, 3),
(9, '2020-06-16 21:59:57', 0, 0, 0, 3),
(9, '2020-06-16 22:01:26', 1, 0, 0, 3),
(9, '2020-06-17 14:21:55', 0, 0, 0, 3),
(9, '2020-06-17 14:24:39', 0, 0, 1, 3),
(9, '2020-06-17 14:25:27', 1, 0, 0, 3),
(9, '2020-06-17 14:29:10', 0, 0, 0, 7),
(9, '2020-06-17 14:37:57', 1, 0, 0, 3),
(9, '2020-06-17 15:04:27', 0, 0, 0, 3),
(9, '2020-06-17 15:06:42', 0, 1, 0, 3),
(9, '2020-06-17 15:07:07', 1, 0, 0, 3),
(9, '2020-06-18 08:08:09', 0, 0, 0, 3),
(9, '2020-06-18 08:09:19', 0, 0, 1, 3),
(9, '2020-06-18 08:13:43', 1, 0, 0, 3),
(9, '2020-06-18 08:21:02', 0, 0, 0, 3),
(9, '2020-06-18 08:21:52', 0, 0, 1, 3),
(9, '2020-06-18 08:23:01', 1, 0, 0, 3),
(9, '2020-06-18 08:25:55', 0, 0, 0, 7),
(9, '2020-06-18 08:26:47', 1, 0, 0, 3),
(9, '2020-06-18 08:48:58', 0, 0, 0, 3),
(9, '2020-06-18 08:50:34', 0, 0, 1, 3),
(9, '2020-06-18 08:51:25', 1, 0, 0, 3),
(10, '2020-06-16 20:38:05', 1, 0, 0, 4),
(10, '2020-06-16 21:17:41', 1, 0, 0, 4),
(10, '2020-06-16 21:25:19', 0, 0, 0, 10),
(10, '2020-06-16 21:31:44', 1, 0, 0, 4),
(10, '2020-06-16 22:00:06', 0, 0, 0, 4),
(10, '2020-06-16 22:03:25', 0, 0, 1, 4),
(10, '2020-06-16 22:03:49', 1, 0, 0, 4),
(10, '2020-06-16 22:06:07', 0, 0, 0, 10),
(10, '2020-06-16 22:07:44', 1, 0, 0, 4),
(10, '2020-06-17 14:22:03', 0, 0, 0, 4),
(10, '2020-06-17 14:25:00', 1, 0, 0, 4),
(10, '2020-06-17 14:27:09', 0, 0, 0, 10),
(10, '2020-06-17 14:30:26', 1, 0, 0, 4),
(10, '2020-06-17 15:04:52', 0, 0, 0, 4),
(10, '2020-06-17 15:06:56', 0, 0, 1, 4),
(10, '2020-06-17 15:08:04', 1, 0, 0, 4),
(10, '2020-06-18 08:08:17', 0, 0, 0, 4),
(10, '2020-06-18 08:09:31', 0, 0, 0, 4),
(10, '2020-06-18 08:10:19', 1, 0, 0, 4),
(10, '2020-06-18 08:21:16', 0, 0, 0, 4),
(10, '2020-06-18 08:21:58', 1, 0, 0, 4),
(10, '2020-06-18 08:49:13', 0, 0, 0, 4),
(10, '2020-06-18 08:50:51', 1, 0, 0, 4),
(11, '2020-06-16 20:38:14', 1, 0, 0, 5),
(11, '2020-06-16 20:54:03', 0, 0, 0, 9),
(11, '2020-06-16 20:54:58', 0, 0, 0, 5),
(11, '2020-06-16 21:17:46', 1, 0, 0, 5),
(11, '2020-06-16 21:25:19', 0, 0, 0, 10),
(11, '2020-06-16 21:31:06', 1, 0, 0, 5),
(11, '2020-06-16 21:31:11', 1, 0, 0, 5),
(11, '2020-06-16 21:31:23', 1, 0, 0, 5),
(11, '2020-06-16 21:59:27', 0, 0, 0, 9),
(11, '2020-06-16 22:02:33', 0, 1, 0, 9),
(11, '2020-06-16 22:04:27', 1, 0, 0, 5),
(11, '2020-06-16 22:06:08', 0, 0, 0, 10),
(11, '2020-06-16 22:07:49', 1, 0, 0, 5),
(11, '2020-06-16 22:09:37', 0, 0, 0, 9),
(11, '2020-06-17 14:15:45', 1, 0, 0, 5),
(11, '2020-06-17 14:21:20', 0, 0, 0, 9),
(11, '2020-06-17 14:25:07', 1, 0, 0, 5),
(11, '2020-06-17 14:27:09', 0, 0, 0, 10),
(11, '2020-06-17 14:30:31', 1, 0, 0, 5),
(11, '2020-06-17 14:31:24', 0, 0, 0, 9),
(11, '2020-06-17 14:38:05', 1, 0, 0, 5),
(11, '2020-06-17 15:01:39', 0, 0, 0, 9),
(11, '2020-06-17 15:07:53', 1, 0, 0, 5),
(11, '2020-06-18 08:07:49', 0, 0, 0, 9),
(11, '2020-06-18 08:14:12', 1, 0, 0, 5),
(11, '2020-06-18 08:20:49', 0, 0, 0, 9),
(11, '2020-06-18 08:22:05', 1, 0, 0, 5),
(11, '2020-06-18 08:23:47', 0, 0, 0, 9),
(11, '2020-06-18 08:24:48', 0, 1, 0, 9),
(11, '2020-06-18 08:25:02', 1, 0, 0, 5),
(11, '2020-06-18 08:26:03', 0, 0, 0, 9),
(11, '2020-06-18 08:26:53', 1, 0, 0, 5),
(11, '2020-06-18 08:48:10', 0, 0, 0, 9),
(11, '2020-06-18 08:50:57', 1, 0, 0, 5),
(11, '2020-06-18 08:52:12', 0, 0, 0, 9),
(11, '2020-06-18 08:52:56', 1, 0, 0, 5),
(12, '2020-06-16 20:38:25', 1, 0, 0, 6),
(12, '2020-06-16 20:54:04', 0, 0, 0, 9),
(12, '2020-06-16 21:17:50', 1, 0, 0, 6),
(12, '2020-06-16 21:25:19', 0, 0, 0, 10),
(12, '2020-06-16 21:31:49', 1, 0, 0, 6),
(12, '2020-06-16 21:59:27', 0, 0, 0, 9),
(12, '2020-06-16 22:02:42', 0, 1, 0, 9),
(12, '2020-06-16 22:04:31', 1, 0, 0, 6),
(12, '2020-06-16 22:06:08', 0, 0, 0, 10),
(12, '2020-06-16 22:07:54', 1, 0, 0, 6),
(12, '2020-06-16 22:09:37', 0, 0, 0, 9),
(12, '2020-06-17 14:15:51', 1, 0, 0, 6),
(12, '2020-06-17 14:21:20', 0, 0, 0, 9),
(12, '2020-06-17 14:25:15', 1, 0, 0, 6),
(12, '2020-06-17 14:27:09', 0, 0, 0, 10),
(12, '2020-06-17 14:30:36', 1, 0, 0, 6),
(12, '2020-06-17 14:31:24', 0, 0, 0, 9),
(12, '2020-06-17 14:38:10', 1, 0, 0, 6),
(12, '2020-06-17 15:01:39', 0, 0, 0, 9),
(12, '2020-06-17 15:07:59', 1, 0, 0, 6),
(12, '2020-06-18 08:07:49', 0, 0, 0, 9),
(12, '2020-06-18 08:14:40', 1, 0, 0, 6),
(12, '2020-06-18 08:20:49', 0, 0, 0, 9),
(12, '2020-06-18 08:22:11', 1, 0, 0, 6),
(12, '2020-06-18 08:23:47', 0, 0, 0, 9),
(12, '2020-06-18 08:24:56', 0, 1, 0, 9),
(12, '2020-06-18 08:25:07', 1, 0, 0, 6),
(12, '2020-06-18 08:26:03', 0, 0, 0, 9),
(12, '2020-06-18 08:26:58', 1, 0, 0, 6),
(12, '2020-06-18 08:48:10', 0, 0, 0, 9),
(12, '2020-06-18 08:51:10', 1, 0, 0, 6),
(12, '2020-06-18 08:52:12', 0, 0, 0, 9),
(12, '2020-06-18 08:53:01', 1, 0, 0, 6);

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `tableId` int(11) NOT NULL COMMENT 'Define Table Id',
  `restaurantId` int(100) NOT NULL,
  `tableName` varchar(10) NOT NULL COMMENT 'Table Name',
  `tableMaxNumberSeats` int(11) NOT NULL COMMENT 'Maximum Number of Table Seats',
  `tableImage` varchar(100) DEFAULT NULL COMMENT 'File location of the DefaultTable image',
  `tableImageAvailable` varchar(100) DEFAULT NULL COMMENT 'File location of the Available Table image',
  `tableImageUnavailable` varchar(100) DEFAULT NULL COMMENT 'File location of the Unavailable Table image',
  `tableImageCheckout` varchar(100) DEFAULT NULL COMMENT 'File location of the Checkout Table image',
  `tableImageCleaning` varchar(100) DEFAULT NULL COMMENT 'File location of the Cleaning Table image',
  `tableType` text DEFAULT NULL COMMENT 'Table type',
  `tableSize` text DEFAULT NULL,
  `creationDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`tableId`, `restaurantId`, `tableName`, `tableMaxNumberSeats`, `tableImage`, `tableImageAvailable`, `tableImageUnavailable`, `tableImageCheckout`, `tableImageCleaning`, `tableType`, `tableSize`, `creationDate`) VALUES
(7, 1, 'A[6]', 6, 'A_6_blue', 'A_6_green', 'A_6_red', 'A_6_orange', 'A_6_purple', 'Rectangle', '', '2020-03-17'),
(8, 1, 'B[4]', 4, 'B_4_blue', 'B_4_green', 'B_4_red', 'B_4_orange', 'B_4_purple', 'Rectangle', '', '2019-11-11'),
(9, 1, 'B[2]', 2, 'B_2_blue', 'B_2_green', 'B_2_red', 'B_2_orange', 'B_2_purple', 'Square', '', '2019-09-17'),
(10, 1, 'C1[2]', 2, 'C_1_blue', 'C_1_green', 'C_1_red', 'C_1_orange', 'C_1_purple', 'Square', '', '2019-08-21'),
(11, 1, 'C2[2]', 2, 'C_2_blue', 'C_2_green', 'C_2_red', 'C_2_orange', 'C_2_purple', 'Square', '', '2019-08-21'),
(12, 1, 'C3[2]', 2, 'C_3_blue', 'C_3_green', 'C_3_red', 'C_3_orange', 'C_3_purple', 'Square', '', '2020-06-01');

-- --------------------------------------------------------

--
-- Table structure for table `waitlistentries`
--

CREATE TABLE `waitlistentries` (
  `waitlistId` int(100) NOT NULL,
  `restaurantId` int(100) NOT NULL,
  `customerId` int(100) NOT NULL,
  `waitlistPartySize` int(11) NOT NULL,
  `waitlistStatus` varchar(20) NOT NULL,
  `wailistOrigin` varchar(20) NOT NULL,
  `checkinDateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `seatingDateTime` datetime DEFAULT NULL,
  `checkoutDateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `waitlistentries`
--

INSERT INTO `waitlistentries` (`waitlistId`, `restaurantId`, `customerId`, `waitlistPartySize`, `waitlistStatus`, `wailistOrigin`, `checkinDateTime`, `seatingDateTime`, `checkoutDateTime`) VALUES
(3, 1, 6, 3, 'active', 'app', '2020-06-18 08:05:00', NULL, NULL),
(4, 1, 6, 2, 'active', 'entrance', '2020-06-18 08:15:00', NULL, NULL),
(5, 1, 7, 6, 'active', 'app', '2020-06-18 08:20:00', NULL, NULL),
(6, 1, 3, 2, 'active', 'app', '2020-06-18 08:30:00', NULL, NULL),
(7, 1, 4, 5, 'active', 'app', '2020-06-18 08:35:00', NULL, NULL),
(8, 1, 5, 3, 'active', 'app', '2020-06-18 08:40:00', NULL, NULL),
(9, 1, 5, 4, 'active', 'app', '2020-06-18 08:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `waitlistentrytables`
--

CREATE TABLE `waitlistentrytables` (
  `waitlistId` int(100) NOT NULL,
  `tableId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clustertables`
--
ALTER TABLE `clustertables`
  ADD PRIMARY KEY (`clusterId`,`tableId`),
  ADD KEY `clustertables_ibfk_2` (`tableId`) USING BTREE,
  ADD KEY `clustertables_ibfk_1` (`clusterId`) USING BTREE;

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerId`);

--
-- Indexes for table `layoutclusters`
--
ALTER TABLE `layoutclusters`
  ADD PRIMARY KEY (`clusterId`),
  ADD KEY `layoutclusters_ibfk_1` (`layoutId`) USING BTREE;

--
-- Indexes for table `layouts`
--
ALTER TABLE `layouts`
  ADD PRIMARY KEY (`layoutId`),
  ADD KEY `layouts_ibfk_1` (`restaurantId`) USING BTREE;

--
-- Indexes for table `reservationentries`
--
ALTER TABLE `reservationentries`
  ADD PRIMARY KEY (`reservationId`),
  ADD KEY `reservationentries_ibfk_1` (`restaurantId`),
  ADD KEY `reservationentries_ibfk_2` (`customerId`);

--
-- Indexes for table `reservationentrytables`
--
ALTER TABLE `reservationentrytables`
  ADD PRIMARY KEY (`reservationId`,`tableId`),
  ADD KEY `reservationentrytables_ibfk_1` (`reservationId`) USING BTREE,
  ADD KEY `reservationentrytables_ibfk_2` (`tableId`) USING BTREE;

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`RestaurantId`),
  ADD KEY `layoutActive` (`layoutActive`);

--
-- Indexes for table `tableavailability`
--
ALTER TABLE `tableavailability`
  ADD PRIMARY KEY (`tableId`,`dateTime`),
  ADD KEY `tableavailability_ibfk_2` (`clusterId`) USING BTREE,
  ADD KEY `tableavailability_ibfk_1` (`tableId`) USING BTREE;

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`tableId`),
  ADD KEY `tables_ibfk_1` (`restaurantId`) USING BTREE;

--
-- Indexes for table `waitlistentries`
--
ALTER TABLE `waitlistentries`
  ADD PRIMARY KEY (`waitlistId`),
  ADD KEY `waitlistentries_ibfk_1` (`customerId`),
  ADD KEY `waitlistentries_ibfk_2` (`restaurantId`);

--
-- Indexes for table `waitlistentrytables`
--
ALTER TABLE `waitlistentrytables`
  ADD PRIMARY KEY (`waitlistId`,`tableId`),
  ADD KEY `waitlistentrytables_ibfk_1` (`tableId`),
  ADD KEY `waitlistentrytables_ibfk_2` (`waitlistId`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerId` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `layoutclusters`
--
ALTER TABLE `layoutclusters`
  MODIFY `clusterId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `layouts`
--
ALTER TABLE `layouts`
  MODIFY `layoutId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Define Restaurant Layout Id', AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservationentries`
--
ALTER TABLE `reservationentries`
  MODIFY `reservationId` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `RestaurantId` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `tableId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Define Table Id', AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `waitlistentries`
--
ALTER TABLE `waitlistentries`
  MODIFY `waitlistId` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clustertables`
--
ALTER TABLE `clustertables`
  ADD CONSTRAINT `clustertables_ibfk_1` FOREIGN KEY (`clusterId`) REFERENCES `layoutclusters` (`clusterId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `clustertables_ibfk_2` FOREIGN KEY (`tableId`) REFERENCES `tables` (`tableId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `layoutclusters`
--
ALTER TABLE `layoutclusters`
  ADD CONSTRAINT `layoutclusters_ibfk_1` FOREIGN KEY (`layoutId`) REFERENCES `layouts` (`layoutId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `layouts`
--
ALTER TABLE `layouts`
  ADD CONSTRAINT `layouts_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`RestaurantId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `reservationentries`
--
ALTER TABLE `reservationentries`
  ADD CONSTRAINT `reservationentries_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`RestaurantId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `reservationentries_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `customers` (`CustomerId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `reservationentrytables`
--
ALTER TABLE `reservationentrytables`
  ADD CONSTRAINT `reservationentrytables_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservationentries` (`reservationId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `reservationentrytables_ibfk_2` FOREIGN KEY (`tableId`) REFERENCES `tableavailability` (`tableId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`layoutActive`) REFERENCES `layouts` (`layoutId`);

--
-- Constraints for table `tableavailability`
--
ALTER TABLE `tableavailability`
  ADD CONSTRAINT `tableavailability_ibfk_1` FOREIGN KEY (`tableId`) REFERENCES `clustertables` (`tableId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `tableavailability_ibfk_2` FOREIGN KEY (`clusterId`) REFERENCES `clustertables` (`clusterId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`RestaurantId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `waitlistentries`
--
ALTER TABLE `waitlistentries`
  ADD CONSTRAINT `waitlistentries_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`CustomerId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `waitlistentries_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`RestaurantId`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `waitlistentrytables`
--
ALTER TABLE `waitlistentrytables`
  ADD CONSTRAINT `waitlistentrytables_ibfk_1` FOREIGN KEY (`tableId`) REFERENCES `tableavailability` (`tableId`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `waitlistentrytables_ibfk_2` FOREIGN KEY (`waitlistId`) REFERENCES `waitlistentries` (`waitlistId`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
