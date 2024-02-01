/* Include packages needed for this application */
const inquirer = require('inquirer');
const mysql = require('mysql2');

/* Use mysql to create a connection with the database 'employee_tracker_db' */
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
 * Create an array of menu options for inquirer and include the following choices: 
 * View all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
 */ 
const menuOptions = [
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
    console.log('\n');

    await inquirer.prompt(menuOptions)
    .then((answer) => {
        switch (answer.request) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
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
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                console.info('Closing connection with the database... Done! Goodbye\n');
                break;
        }
    });
}

/**
 * @function viewDepartments
 * Query 'department' data and present a table with department names and department ids
 */ 
function viewDepartments() {
    const query = `SELECT * FROM department`;

    // Query the db for department data
    db.query(query, (err, data) => {
        if (err) throw err;
        
        // Present the data to the user as a table, then prompt the user again for a desired action in the db
        console.table(data);
        promptUser();
    });
}

/**
 * @function viewRoles
 * Query 'role' data and present a table with the job title, role id, the department that role belongs to, and the salary for that role
 */
function viewRoles() {
    // Build a query string to join the 'role' and 'department' tables where role.department_id = department.id
    const query = 
    `
        SELECT r.id, r.title, d.name AS department, r.salary
        FROM role r 
        JOIN department d 
        ON r.department_id = d.id
    `;

    // Run the query and present the data to the user in a table
    db.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        promptUser();
    });
}

/**
 * @function viewEmployees
 * Query 'employee' data and present a table including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
 */
function viewEmployees() {
    /* Build a query string to join the 'employee', 'role', and 'department' tables where: 
     *  employee.role_id = role.id
     *  role.department_id = department.id
     *  manager.id = employee.manager_id
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

    // Run the query and present the data to the user in a table
    db.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
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
            name: 'department',
            message: 'What is the name of the department you would like to add?',
        }
    ]).then((answer) => {
        var deptName = answer.department;

        // Build the query using the inquirer answer provided 
        const query = 
        `
            INSERT INTO department (name)
            VALUES ('${deptName}')
        `;
        
        // Run the query to add the name into the 'department' table and notify the user it was completed
        db.query(query, (err, data) => {
            if (err) throw err;
            console.log(`And... done! The '${deptName}' department was added to the database!`);
            promptUser();
        });
    });
}

/**
 * @function addRole
 * Prompts the user to enter the name, salary, and department for the role. The role is then added to the database
 */
function addRole() {
    // Query the available department names
    var deptQuery = `SELECT * FROM department`;
    
    db.query(deptQuery, (err, deptData) => {
        if (err) throw err;

        // Get an array of department names for inquirer
        const deptChoices = deptData.map(dept => dept.name);
        
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
            const departmentObj = deptData.find(dept => {
                if (dept.name == department) {
                    return dept;
                }
            });
        
            // Build the query string to add the new role into the table
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
            db.query(query, (err, data) => {
                if (err) throw err;
                console.log(`And... done! The '${title}' role was added to the database!`);
                promptUser();
            });
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
            
            if (manager == 'None') {
                // If the user selected 'None', the added employee will have 'null' as their manager
                manager = null;
            } else {
                // else, find the employee object to retrieve the id to enter as manager_id
                manager = result.find(employee => {
                    if (employee.name == manager) {
                        return employee;
                    }
                });
                manager = manager.id;
            }

            // Build the query string using the inquirer answer provided 
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

/**
 * @function updateEmployeeRole
 * Prompts the user to select an employee to update and their new role and this information is updated in the database
 */
function updateEmployeeRole() {
    var empQuery = `SELECT * FROM employee`;
    var roleQuery = `SELECT * FROM role`;

    // Query the db for the list of available employees
    db.query(empQuery, (err, employeeData)=> {
        if (err) throw err;
        
        // Query the db for the list of available roles
        db.query(roleQuery, (err, roleData) => {
            if (err) throw err;
            
            // Map an array of employee name choices and role title choices for Inquirer 
            var empChoices = employeeData.map((emp => emp.first_name + ' ' + emp.last_name));
            var roleChoices = roleData.map(role => role.title);

            // Use inquirer to ask user which employee they'd like to update, then to what role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee\'s role do you want to update?',
                    choices: empChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Okay! Which role do you want to assign to the selected employee?',
                    choices: roleChoices
                }
            ]).then(answer => {
                // Find the target employee object to retrieve the employee id 
                const targetEmp = employeeData.find(empObj => {
                    const empObjName = `${empObj.first_name} ${empObj.last_name}`;
                
                    if (empObjName == answer.employee) {
                        return empObj;
                    }
                });

                // Find the target role object to retrieve the role id
                const targetRole = roleData.find(roleObj => {
                    if (roleObj.title == answer.role) {
                        return roleObj;
                    }
                });
                
                // Build the query string using targetEmp.id and targetRole.id
                const query = 
                `
                    UPDATE employee
                    SET role_id = ${targetRole.id}
                    WHERE id = ${targetEmp.id}
                `;

                // Run the query to update the role_id of the employee with employee_id
                db.query(query, (err, res) => {
                    err ? console.log(err) : console.log(`And... done! The role for the employee '${answer.employee}' was changed to '${answer.role}'!`);
                    console.log('\n');
                    promptUser();
                });
            });
        });
    });
}

promptUser();
