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

//sample database
// const connection = mysql.createConnection({
//     host: 'localhost'  ,
//     user: 'root',
//     database: 'test'
// })
promptMainMenu();

function promptMainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            loop: true,
            name: 'mainMenu',
            message: 'Please make a selection:',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
        }
    ])
    .then((answer) => {
        console.log(JSON.stringify(answer.mainMenu))

        //add branching to call respective functions
    })
}

function departmentList() {
    //call database to get list of all epartments
}

function roleList() {
    //call database to get list of all roles
}

function employeeList() {
    //call database to get list of all roles
}

function addDepartment() {
    //prompt for answers and write to database
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: `Enter in the new department's name:`
        }
    ])
    .then((answer) => {
        //create new data point in the table 'Departments'

        //add an id that is randomly generated
        console.log(JSON.stringify(answer))
    })
}

function addRole() {
    //prompt for answers and write to database (name,salary,department)
    inquirer.prompt([
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
            type: 'input',
            name: 'department',
            message: `Enter in the department that this role belongs to:`
        }
    ])
    .then((answer) => {
        //create new data point in the table 'Roles'

        //add an id that is randomly generated
        console.log(JSON.stringify(answer))
    })
}

function addEmployee() {
    //prompt for answers and write to database (first,last,role,manager)
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: `Enter in the new employee's first name:`
        }
    ])
    .then((answer) => {
        //create new data point in the table 'Departments'
        console.log(JSON.stringify(answer))
    })
}

function updateEmployeeRole() {
    //select an employee from list, then choose new role from new list
    
}