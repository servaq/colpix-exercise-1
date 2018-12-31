/*
 Navicat Premium Data Transfer

 Source Server         : .root@local
 Source Server Type    : MySQL
 Source Server Version : 50638
 Source Host           : localhost:3306
 Source Schema         : colpix-e1

 Target Server Type    : MySQL
 Target Server Version : 50638
 File Encoding         : 65001

 Date: 31/12/2018 17:32:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for employees
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `supervisor_id` int(10) unsigned DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_supervisor` (`supervisor_id`) USING BTREE,
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of employees
-- ----------------------------
BEGIN;
INSERT INTO `employees` VALUES (1, 'Carlos', 'carlos@carlos', NULL, '2018-12-28 22:59:26');
INSERT INTO `employees` VALUES (2, 'Francisco', 'francisco@francisco', 1, '2018-12-29 14:13:55');
INSERT INTO `employees` VALUES (3, 'Fernando', 'fernando@fernando', 1, '2018-12-29 14:14:22');
INSERT INTO `employees` VALUES (4, 'Antonio', 'antonio@antonio', NULL, '2018-12-29 14:14:50');
INSERT INTO `employees` VALUES (5, 'Bernardo', 'bernardo@bernardo', 4, '2018-12-29 14:15:13');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
