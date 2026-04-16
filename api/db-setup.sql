-- RD Harmony Med Spa - Database Setup
-- Run this in cPanel > phpMyAdmin

CREATE DATABASE IF NOT EXISTS rd_harmony;
USE rd_harmony;

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service VARCHAR(255) NOT NULL,
    service_type ENUM('In-Clinic', 'Mobile') DEFAULT 'In-Clinic',
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    price VARCHAR(50) DEFAULT NULL,
    notes TEXT,
    status ENUM('confirmed', 'completed', 'cancelled', 'no-show') DEFAULT 'confirmed',
    reminder_1month_sent TINYINT(1) DEFAULT 0,
    reminder_1week_sent TINYINT(1) DEFAULT 0,
    reminder_5day_sent TINYINT(1) DEFAULT 0,
    sms_reminder_sent TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    email_type ENUM('confirmation', 'reminder_1month', 'reminder_1week', 'reminder_5day') NOT NULL,
    sent_to VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'failed') DEFAULT 'sent',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sms_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'failed') DEFAULT 'sent',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
