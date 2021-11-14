// 1st list of options:
// -view all departments => table w/ department names and ids
// -view all roles => table w/ job title, id, department, & salary
// -view all employees => table w/ employee id, first name, last name, job titles, departments, salaries, and managers
// -add a department => prompted to enter name of the department (will add an id randomly)
// -add an role => prompted to enter the name of the role, salary, & department
// -add an employee => prompted to enter the first name, last name, role, & manager
// -update employee role => prompted to select an employee to update, and select their role...then is updated

const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
 
require('dotenv').config()

//pull database in database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'company_db',
    password: process.env.DB_PASS,
})

promptMainMenu();

function promptMainMenu() {
    return inquirer.prompt([
        {
            type: 'list',
            loop: true,
            name: 'mainMenu',
            message: 'Please make a selection:',
            choices: ['View all departments', 'View all roles', 'View all employees', 'View Employees by Manager','Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Update manager role', 'Quit']
        }
    ])
        .then((answer) => {
            console.log(JSON.stringify(answer.mainMenu))

            // add switch to call respective functions
            switch (answer.mainMenu) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View Employees by Manager':
                    viewByManager();
                    break;
                case 'Add a department':
                    addDepartment()
                    break;
                case 'Add a role':
                    addRole()
                    break;
                case 'Add an employee':
                    addEmployee()
                    break;
                case 'Update employee role':
                    updateEmployeeRole()
                    break;
                case 'Update manager role':
                    updateEmployeeManager()
                    break;
                case 'Quit':
                    console.log('Exiting program....')
                    process.exit;
                    break;
                default:
                    console.log(`Throwing an error.I have no clue what happened.Exiting the program...`)
            }
        })
}

//----------------------------View *----------------------------//
function viewDepartments() {
    db.execute(`SELECT * FROM ${table}`, (err, results) => {
        console.table(results);
        promptMainMenu();
    })
}

function viewRoles() {
    db.execute(`SELECT roles.id, roles.title, roles.salary, departments.name as department FROM roles LEFT JOIN departments 
    ON roles.department_id = departments.id;`, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.table(results)
        }
    })
}

function viewEmployees() {
    db.execute(`SELECT employees.id, CONCAT (employees.first_name, ' ',employees.last_name) as employee, roles.title, departments.name AS department, 
    roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employees
     LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id 
     LEFT JOIN employees manager ON employees.manager_id = manager.id`, (err, results) =>{
         if (err) {
             console.log(err)
         } else {
             console.table(results)
             promptMainMenu();
         }
     })
}

function viewByManager() {

    const prompt = (value)  => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Select a manager: ',
                choices: value
            }
        ])
    }

    buildManagerList
        .then((value) => {return value})
        .then(prompt)
        .then((answer) => {
            answer = JSON.parse(JSON.stringify(answer))

            db.execute(`SELECT employees.id, CONCAT (employees.first_Name, ' ', employees.last_Name) as Employees, roles.title FROM employees 
            LEFT JOIN roles on employees.role_id = roles.id WHERE employees.manager_id = ${answer.manager}`, (err, result) =>{
                if (err) {
                    console.log(err);
                } else {
                    console.table(result);
                    promptMainMenu();
                }
            })
        })
}       

//----------------------------Add to *----------------------------//
function addDepartment() {
    console.log(`add department`)
    //prompt for answers and write to database
    return inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: `Enter in the new department's name:`
        }
    ])
        .then((answer) => {
            //create new data point in the table 'Departments'
            //add an id that is randomly generated

            answer = JSON.parse(JSON.stringify(answer))
            db.execute(`INSERT INTO departments (name) VALUES ("${answer.departmentName}")`, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Department added....')
                    promptMainMenu();
                }
            })

        })
}

function addRole() { 
    //generate the array of departments
    let departmentArray = []
    db.execute(`SELECT * FROM departments`, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            results.forEach(result => departmentArray.push({name: result.name, value: result.id}))
        }
    })
    //prompt for answers and write to database (name,salary,department)
    return inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: `Enter in the new roles's name:`
        },
        {
            type: 'input',
            name: 'salary',
            message: `Enter in the salary for this role:`
        },
        {
            type: 'list',
            name: 'department',
            message: `Enter in the department that this role belongs to:`,
            choices: departmentArray
        }
    ])
    .then((answer) => {
        // create new data point in the table 'Roles'
        // add an id that is randomly generated
        answer = JSON.parse(JSON.stringify(answer))  
        db.execute(`INSERT INTO roles (title, salary, department_id) VALUES ("${answer.roleName}", ${answer.salary}, ${answer.department})`, (err, results) => {
            if (err) {
                console.log(err)
                promptMainMenu();
            } else {
                console.log('The new role has been added')
                promptMainMenu();
            }
        })  
    })
}

function addEmployee() {
    console.log(`add employee`)
    //prompt for answers and write to database (first,last,role,manager)
    //pull data from database for the role manager and a push it into an array to be call in the last prompt
    const prompt = (value) => {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `Enter in the new employee's first name:`
            },
            {
                type: 'input',
                name: 'lastName',
                message: `Enter in the new employee's last name:`
            },
            {
                type: 'list',
                name: 'role',
                message: `Enter in the new employee's role:`,
                //choice is going to be an array taken from the table Roles
                choices: value[1]
            }, {
                type: 'list',
                name: 'manager',
                message: `Select the manager:`,
                //choice is going to be an array taken from the table Roles and filter by manager only.
                choices: value[0]
            }
        ])
    }

    Promise.all([buildManagerList, buildRolesList])
        .then(value => { return value })
        .then(prompt)
        .then((answer) => {
            answer = JSON.parse(JSON.stringify(answer))
            db.execute(`INSERT INTO employees (first_Name, last_Name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${answer.role}, ${answer.manager})`, (err, result) => {
                if (err) {
                    console.log(err)
                    promptMainMenu();
                } else {
                    console.log("Employee Added to Database");
                    promptMainMenu();
                }
            })
        })
}

//----------------------------Update *----------------------------//
function updateEmployeeRole() {
    console.log(`update employee`)
    //select an employee from list, then choose new role from new list
    const prompt = (value) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: `Select the employee to update:`,
                //choice is going to be an array taken from the table employees.
                choices: value[0]
            },
            {
                type: 'list',
                name: 'role',
                message: `Select the new role:`,
                //choice is going to be an array taken from the table Roles.
                choices: value[1]
            }
        ])
    }

    Promise.all([buildEmployeeList, buildRolesList])
        .then((value) => { return value })
        .then(prompt)
        .then((answer) => {
            answer = JSON.parse(JSON.stringify(answer))
            db.execute(`UPDATE employees SET role_id = ${answer.role} WHERE id = ${answer.employee}`, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Employee's role has been updated...`);
                    promptMainMenu();
                }
            });
        })
    }

function updateEmployeeManager() {
    Promise.all([buildEmployeeList, buildManagerList])
    .then((value) => {return value})
    .then(prompt)
    .then((answer) => {
        answer = JSON.parse(JSON.stringify(answer));

        db.execute(`UPDATE employees SET manager_id = ${answer.manager} WHERE id = ${answer.employee}`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Employee's manager has been updated...`);
                promptMainMenu();
            }
        })
    })

    const prompt = (value) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee to update: ',
                choices: value[0]
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Select the new the manager that the employee will be assigned to: ',
                choices: value[1]
            }
        ])
    }
}
//------------------------Global Promises--------------------------//
let buildRolesList = new Promise((resolve, reject) => {
    let roleList = [];
    db.execute(`SELECT * FROM roles`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            results.forEach((result) => roleList.push({ name: result.title, value: result.id }));
            resolve(roleList);
        }
    })
})

let buildManagerList = new Promise((resolve, reject) => {
    let managerList = [{ name: 'None', value: null }];
    db.execute(`SELECT * FROM employees where role_id < 3`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            results.forEach((result) => managerList.push({ name: result.first_Name + ' ' + result.last_Name, value: result.id }));
            resolve(managerList);
        }
    })
})

let buildEmployeeList = new Promise((resolve, reject) => {
    let employeeList = [];
    db.execute(`SELECT * FROM employees`, (err, results) => {
        if (err) {
            reject(err);
        } else {
            results.forEach((result) => employeeList.push({ name: result.first_Name + ' ' + result.last_Name, value: result.id }));
            resolve(employeeList);
        }
    })
})