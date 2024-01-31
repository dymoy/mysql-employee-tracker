/* Include packages needed for this application */
const inquirer = require('inquirer');
const mysql = require('mysql2');

/* Use mysql to create connection with database */
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'mysql123',
        database: 'employee_tracker_db'
    },
    console.log("Welcome to the MySQL Employee Tracker Database!")
);

/** 
 * Create an array of questions for inquirer and include the following choices: 
 * View all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
 */ 
const questions = [
    {
        type: 'list',
        name: 'request',
        message: 'What would you like to do? ',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ],
        default: "View all departments"
    },
];

/**
 * @function promptUser
 * Asynchronous function that will prompt the user for the desired action in employee_tracker_db
 */
async function promptUser() {
    await inquirer.prompt(questions)
    .then((answer) => {
        switch (answer.request) {
            case 'View all departments':
                getDepartments();
                break;
            case 'View all roles':
                getRoles();
                break;
            case 'View all employees':
                getEmployees();
                break;
            case 'Exit':
                return;
        }
    });
}

/**
 * @function getDepartments
 * Queries all data from the 'department' table in the employee_tracker_db
 */ 
function getDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        err ? console.log(err) : console.table(res);
        console.log('\n');
        promptUser();
    });
}

/**
 * @function getRoles
 * Queries all data from the 'role' table in the employee_tracker_db
 */
function getRoles() {
    db.query('SELECT * FROM role', (err, res) => {
        err ? console.log(err) : console.table(res);
        console.log('\n');
        promptUser();
    });
}

/**
 * @function getEmployees
 * Queries all data from the 'employee' table in the employee_tracker_db
 */
function getEmployees() {
    db.query('SELECT * FROM employee', (err, res) => {
        err ? console.log(err) : console.table(res);
        console.log('\n');
        promptUser();
    });
}

promptUser();
