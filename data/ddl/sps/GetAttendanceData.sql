

CREATE PROCEDURE GetAttendanceData(IN typeId VARCHAR(100), IN entryDate DATE, IN kind VARCHAR(100))
BEGIN
    #comparação por dia
    CASE
      WHEN kind = "DAY" THEN
        select `Attendances`.employeeId, startDate ,endDate, avatar,code, firstName, lastName, typeId from `Attendances` 
            inner join `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            inner join `Persons` on Employees.id = Persons.`employeeId` 
        where Attendances.typeId = typeId and DATE(Attendances.startDate) = DATE(entryDate);
      WHEN kind = "NONE" THEN
        select startDate ,endDate, avatar,code, firstName, lastName, typeId from `Attendances` 
            inner join `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            inner join `Persons` on Employees.id = Persons.`employeeId` 
        where Attendances.typeId = typeId and LEFT(DATE(entryDate),7) = LEFT(Attendances.startDate,7);
      ELSE
        SELECT 
            Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName
            from `Attendances` inner join `Employees` on Employees.id = Attendances.`employeeId`
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
            INNER JOIN Persons on Persons.`employeeId` = Employees.id
            where Contracts.isActive = 1 and Attendances.typeId = typeId; 
    END CASE;    
END;

CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2023-10-10","DAY");
#CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2022-03-10","DAY");

select * from `Attendances`;

SELECT 
    Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName
    from `Attendances` inner join `Employees` on Employees.id = Attendances.`employeeId`
    LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
    INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
    INNER JOIN Persons on Persons.`employeeId` = Employees.id
    where Contracts.isActive = 1 and Attendances.typeId = "2";

SELECT 
    Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName
    from `Attendances` inner join `Employees` on Employees.id = Attendances.`employeeId`
    LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
    INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
    INNER JOIN Persons on Persons.`employeeId` = Employees.id
    where Contracts.isActive = 1 and Attendances.typeId = "46f04abc-05f4-4a15-aaea-3e94cc82b8ff";