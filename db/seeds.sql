INSERT INTO departments (name)
VALUES  ("Customer Service"),
        ("Analytics"),
        ("Management"),
        ("Product Design");

INSERT INTO roles (title, salary, department_id)
VALUES  ('Manager', 60000.00, 3),
        ('Project Manager', 90000.00, 3),
        ('Sales Representative', 40000.00, 1),
        ('Customer Representative', 20000.00, 1),
        ('Data Analyst', 45000.00, 2),
        ('Product Engineer', 75000.00, 4);

INSERT INTO employees (first_Name, last_Name, role_id, manager_id)
VALUES  ('Beth', 'Smith', 1, NULL),
        ('Rick', 'Sanchez', 2, NULL),
        ('Morty', 'Smith', 6, 2),
        ('Summer', 'Smith', 3, 1),
        ('Jerry', 'Smith', 4, 1),
        ('Mr.', 'Poopybutthole', 5, 2);