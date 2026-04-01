-- CampusRide Database Schema
-- MySQL 8.0+
-- Run as root: mysql -u root -p < database/schema.sql

-- Create database and user
CREATE DATABASE IF NOT EXISTS campusride_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'campusride'@'localhost' IDENTIFIED BY 'campusride123';
GRANT ALL PRIVILEGES ON campusride_db.* TO 'campusride'@'localhost';
FLUSH PRIVILEGES;

USE campusride_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone_number VARCHAR(20),
    profile_picture VARCHAR(500),
    role ENUM('USER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'USER',
    google_id VARCHAR(100) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    college_name VARCHAR(200),
    student_id VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    origin_lat DECIMAL(10, 7),
    origin_lng DECIMAL(10, 7),
    destination_lat DECIMAL(10, 7),
    destination_lng DECIMAL(10, 7),
    departure_time DATETIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price_per_seat DECIMAL(10, 2),
    vehicle_model VARCHAR(100),
    vehicle_number VARCHAR(20),
    notes VARCHAR(500),
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_driver (driver_id),
    INDEX idx_status_departure (status, departure_time),
    INDEX idx_origin_destination (origin, destination)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ride_id BIGINT NOT NULL,
    seats_booked INT NOT NULL DEFAULT 1,
    status ENUM('CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_ride (ride_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    reviewed_user_id BIGINT NOT NULL,
    ride_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_reviewed_user (reviewed_user_id)
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    route_name VARCHAR(200) NOT NULL,
    driver_name VARCHAR(100),
    capacity INT,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    schedule_info VARCHAR(300),
    INDEX idx_status (status)
);

-- Bus locations table
CREATE TABLE IF NOT EXISTS bus_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    speed DECIMAL(5, 2),
    next_stop VARCHAR(200),
    eta_minutes INT,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    INDEX idx_bus_recorded (bus_id, recorded_at DESC)
);

-- Sample bus data
INSERT INTO buses (bus_number, route_name, driver_name, capacity, status, start_location, end_location, schedule_info) VALUES
('CR-001', 'North Campus – Main Gate', 'Ravi Kumar', 45, 'ACTIVE', 'North Campus Hostel', 'Main Gate', 'Every 20 mins, 7AM–9PM'),
('CR-002', 'South Campus – Library', 'Suresh Reddy', 40, 'ACTIVE', 'South Campus', 'Central Library', 'Every 30 mins, 8AM–8PM'),
('CR-003', 'Engineering Block – Sports Ground', 'Priya Singh', 35, 'ACTIVE', 'Engineering Block', 'Sports Ground', 'Every 25 mins, 6AM–10PM');

INSERT INTO bus_locations (bus_id, latitude, longitude, speed, next_stop, eta_minutes) VALUES
(1, 17.3850, 78.4867, 30.0, 'Engineering Block', 5),
(2, 17.3870, 78.4880, 25.0, 'Admin Block', 8),
(3, 17.3860, 78.4873, 28.0, 'Sports Ground', 4);
