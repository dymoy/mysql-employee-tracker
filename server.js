/* Include packages needed for this application */
const inquirer = require('inquirer');

/** 
 * Create an array of questions for inquirer and include the following choices: 
 * View all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
 */ 
const questions = [
    {
        type: 'list',
        name: 'text',
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

/* Create a function to initialize app */
function init() {
    console.log("Welcome to the MySQL Employee Tracker Database!");
    
    // Prompt the user with the questions and then write data to 'logo.svg'
    inquirer.prompt(questions)
    .then((answer) => {
        console.log(answer.text);
    });
}

/* Function call to initialize app */
init();