-- Active: 1667157413070@@127.0.0.1@3306@nova_ri
DELIMITER //

CREATE PROCEDURE GetEmployeeSearch(IN NAME VARCHAR(100))
BEGIN
    SELECT 
        Persons.firstName, 
        Persons.lastName, 
        Employees.id, 
        Employees.avatar, 
        Employees.code 
    FROM 
        Persons 
    INNER JOIN 
        Employees ON Persons.employeeId = Employees.id 
    WHERE 
        CONCAT(Persons.firstName, ' ', Persons.lastName) LIKE CONCAT(NAME, '%');
END//

DELIMITER ;