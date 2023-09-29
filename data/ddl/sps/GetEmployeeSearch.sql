CREATE PROCEDURE GetEmployeeSearch(IN NAME VARCHAR(100))
BEGIN
    select firstName, lastName, Employees.id, Employees.avatar,Employees.code 
    from `Persons` 
        inner join 
    `Employees` on Persons.`employeeId` = Employees.id 
    where CONCAT(Persons.`firstName`,' ',Persons.`lastName`) LIKE CONCAT(NAME,'%'); 
END;

call GetEmployeeSearch('Brenden K');