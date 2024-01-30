-- Seeds for department table 
INSERT INTO department (name)
VALUES 
    ('Legal'),
    ('Engineering'),
    ('Finance'),
    ('Human Resources');

-- Seeds for role table
INSERT INTO role (title, salary, department_id)
VALUES
    ('Product Legal Counsel', 60000, 1),
    ('Software Engineer', 150000, 2),
    ('Accountant', 105000, 3),
    ('Human Resources Manager', 86000, 4);

-- Seeds for employee table 
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ('Arnaldo', 'Loreta', 1, null),
    ('Ginny', 'Forest', 2, null),
    ('Jonathan', 'Clarke', 2, 2),
    ('Miku', 'Saburo', 3, null),
    ('Kennard', 'Tony', 4, null);