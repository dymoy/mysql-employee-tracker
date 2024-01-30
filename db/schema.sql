-- Drops the employees_db database 
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Uses the employees_db database 
USE employees_db;

-- Creates the table "departments" within employees_db
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

-- Creates the table "roles" within employees_db 
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(6, 0),
    department_id INT
);

-- Creates the table "employee" within employees_db
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);