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
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
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
    const query = `SELECT * FROM department`;

    db.query(query, (err, res) => {
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
 * Query 'employee' data and present a table including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
 */
function getEmployees() {
    /**
     * Build the query to join the 'employee', 'role', and 'department' tables where: 
     * employee.role_id = role.id
     * role.department_id = department.id
     * manager.id = employee.manager_id
     */
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
 * Prompts the user for the name of the department they're adding, then sends a query to add the item in the 'department' table
 */
function addDepartment() {
    // Use inquirer to prompt the user for the requested department name
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you would like to add?',
        }
    ]).then((answer) => {
        var reqName = answer.name;

        // Build the query using the inquirer answer provided 
        const query = 
        `
            INSERT INTO department (name)
            VALUES ('${reqName}')
        `;
        
        // Run the query to add the name into the 'department' table
        db.query(query, (err, res) => {
            err ? console.log(err) : console.log(`And... done! The '${reqName}' department was added to the database!`);
            console.log('\n');
            promptUser();
        });
    });
}

/**
 * @function addRole
 * Retrieves the names and ids of the existing departments in the database for rolePrompt() to use with inquirer
 * @see rolePrompt
 */
function addRole() {
    const deptQuery = `SELECT * FROM department`; 

    db.query(deptQuery, (err, res) => {
        if (err) throw err;
        rolePrompt(res);
    });
}

/**
 * @function rolePrompt
 * Prompts the user to enter the name, salary, and department for the role. The role is then added to the database
 * @param {*} res - the array of objects containing all 'department' name and ids 
 */
function rolePrompt(res) {
    // Get an array of department names for inquirer
    const deptChoices = res.map(dept => dept.name);
    
    // Use inquirer to prompt the user for name, salary, and department for the role 
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role you would like to add?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Okay! What is the salary for this role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Great! Now, which department does this role belong to?',
            choices: deptChoices
        },
    ]).then((answer) => {
        // Destructure the answers provided to inquirer
        var { title, salary, department} = answer;
        
        // Obtain the department_id using the res paramater
        const departmentObj = res.find(dept => {
            if (dept.name == department) {
                return dept;
            }
        });

        // Build the query using the inquirer answer provided 
        const query = 
        `
            INSERT INTO role (title, salary, department_id)
            VALUES (
                '${title}', 
                '${salary}', 
                '${departmentObj.id}'
            )
        `;
        
        // Run the query to add the role into the 'role' table
        db.query(query, (err, res) => {
            err ? console.log(err) : console.log(`And... done! The '${title}' role was added to the database!`);
            console.log('\n');
            promptUser();
        });
    });
}

/**
 * @function addEmployee
 * 
 */
function addEmployee() {
    const roleQuery = `SELECT * FROM role`;

    db.query(roleQuery, (err, res) => {
        if (err) throw err;
        employeePrompt(res);
    });
}

/**
 * @function employeePrompt
 * Prompts the user to enter the employee’s first name, last name, role, and manager. The employee is then added to the database
 * @param {*} res - the array of objects containing all 'role' data
 */
function employeePrompt(res) {
    const roleChoices = res.map((role => role.title));

    const managerQuery = 
    `SELECT id, CONCAT(first_name, ' ', last_name) as name
     FROM employee`;

    db.query(managerQuery, (err, result) => {
        if (err) throw err;

        // Get an array of employee names that can be potential managers, then push a "null" option
        var managerChoices = result.map((manager => manager.name));
        managerChoices.push('None');

        inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: 'What is the first name of the employee you want to add?',
            },
            {
                type: 'input',
                name: 'last',
                message: 'And their last name?',
            },
            {
                type: 'list',
                name: 'role',
                message: 'Great! Now, choose from the list below what their role will be!',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Sounds good. Does this employee have a manager? Choose from the list below.',
                choices: managerChoices
            }
        ]).then(answer => {
            // Destructure the answers provided to inquirer 
            var {first, last, role, manager} = answer;

            // Find the requested role to retrieve the role id 
            const targetRole = res.find(roleObj => {
                if (roleObj.title == role) {
                    return roleObj;
                }
            });
            
            // Find the requested manager to retrieve the manager employee id
            if (manager == 'None') {
                manager = null;
            } else {
                manager = result.find(employee => {
                    if (employee.name == manager) {
                        return employee;
                    }
                });
                manager = manager.id;
            }

            // Build the query using the inquirer answer provided 
            var query = 
            `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (
                    '${first}',
                    '${last}',
                    ${targetRole.id},
                    ${manager}
                )
            `;

            // Run the query to add the new employee into the 'employee' table
            db.query(query, (err, res) => {
                err ? console.log(err) : console.log(`And... done! The employee '${first} ${last}' was added to the database!`);
                console.log('\n');
                promptUser();
            });
        });
    });
}

promptUser();
