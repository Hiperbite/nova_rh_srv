

CREATE PROCEDURE GetAttendanceData(IN typeId VARCHAR(100), IN entryDate DATE, IN kind VARCHAR(100), IN page INTEGER, IN pageSize INTEGER)
BEGIN
    DECLARE _offset INT;
    DECLARE _count INT;
    DECLARE _data INT;

    SET _offset = (page -1) * pageSize;

    select count(*) INTO _count
        from `Attendances` INNER JOIN `Employees` on Employees.id = Attendances.`employeeId`
        LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id                         
    where Contracts.isActive = 1 and Attendances.typeId = typeId; 

    #comparação por dia
    CASE
      WHEN kind = "DATE" THEN
        select Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName, _count as total from `Attendances` 
            INNER JOIN `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            INNER JOIN `Persons` on Employees.id = Persons.`employeeId` 
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId`
        where Attendances.typeId = typeId and DATE(Attendances.startDate) = DATE(entryDate) and Contracts.isActive = 1 ORDER BY Attendances.`createdAt` limit pageSize OFFSET _offset;
      WHEN kind = "MONTH" THEN
        select Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName,_count as total from `Attendances` 
            INNER JOIN `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
            INNER JOIN `Persons` on Employees.id = Persons.`employeeId` 
        where Attendances.typeId = typeId and LEFT(DATE(entryDate),7) = LEFT(Attendances.startDate,7) and Contracts.isActive = 1 ORDER BY Attendances.`createdAt` DESC limit pageSize OFFSET _offset;
      ELSE
        SELECT 
            Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName, _count as total
            from `Attendances` INNER JOIN `Employees` on Employees.id = Attendances.`employeeId`
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
            INNER JOIN Persons on Persons.`employeeId` = Employees.id
            where Contracts.isActive = 1 and Attendances.typeId = typeId ORDER BY Attendances.`createdAt` DESC limit pageSize OFFSET _offset; 
    END CASE;    
END;

CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2023-10-10","MONTH", 1, 2);
#CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2022-03-10","DAY");

select * from `Attendances` order by `createdAt` DESC;

SELECT 
    Attendances.startDate, Attendances.endDate,avatar,Employees.code, D                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         epartments.code, Departments.name, firstName, lastName
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




SELECT * FROM `AttendanceTypes` ORDER BY `createdAt` desc;
    select * from `AttendanceTypes` order by `createdAt` DESC limit 3 OFFSET 2;


    select Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName, "MONTH" from `Attendances` 
            INNER JOIN `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
            INNER JOIN `Persons` on Employees.id = Persons.`employeeId` 
        where Attendances.typeId = "46f04abc-05f4-4a15-aaea-3e94cc82b8ff" and LEFT(DATE("2023-10-10"),7) = LEFT(Attendances.startDate,7) and Contracts.isActive = 1 
        ORDER BY Attendances.`createdAt` desc limit (1+2);

           select Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName, "MONTH" from `Attendances` 
            INNER JOIN `Employees` on `Employees`.id = `Attendances`.`employeeId` 
            LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
            INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId` 
            INNER JOIN `Persons` on Employees.id = Persons.`employeeId` 
        where Attendances.typeId = "46f04abc-05f4-4a15-aaea-3e94cc82b8ff" and LEFT(DATE("2023-10-10"),7) = LEFT(Attendances.startDate,7) and Contracts.isActive = 1 ORDER BY Attendances.`createdAt` desc;