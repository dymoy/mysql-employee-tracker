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
            case 'Add a department':
                addDepartment();
                break;
            case 'Exit':
                db.end();
                console.info('Closing connection with the database... Done! Goodbye.');
                break;
        }
    });
}

/**
 * @function getDepartments
 * Query 'department' data and present a table with department names and department ids
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
 * Query 'role' data and present a table with the job title, role id, the department that role belongs to, and the salary for that role
 */
function getRoles() {
    const query = 
    `
        SELECT r.id, r.title, d.name AS department, r.salary
        FROM role r 
        JOIN department d 
        ON r.department_id = d.id
    `;

    db.query(query, (err, res) => {
        err ? console.log(err) : console.table(res);
        console.log('\n');
        promptUser();
    });
}

/**
 * @function getEmployees
 * Queries employee data - including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
 */
function getEmployees() {
    const query = 
    `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role r 
        ON e.role_id = r.id
        JOIN department d
        ON r.department_id = d.id
        LEFT JOIN employee m
        ON m.id = e.manager_id
    `;

    db.query(query, (err, res) => {
        err ? console.log(err) : console.table(res);
        console.log('\n');
        promptUser();
    });
}

/**
 * @function addDepartment
 * 
 */
function addDepartment() {

}
promptUser();
