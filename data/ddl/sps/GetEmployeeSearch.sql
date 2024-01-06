DROP PROCEDURE GetEmployeeSearch -- Active: 1667157413070@@127.0.0.1@3306@nova_rh
DELIMITER //
CREATE PROCEDURE GetEmployeeSearch(IN NAME VARCHAR(100))

BEGIN
    select firstName, lastName, Employees.id, Employees.avatar,Employees.code 
    from `Persons` 
        inner join 
    `Employees` on Persons.`employeeId` = Employees.id 
    where CONCAT(Persons.`firstName`,' ',Persons.`lastName`) LIKE CONCAT(NAME,'%'); 
END;
//
call GetEmployeeSearch('Brenden K');