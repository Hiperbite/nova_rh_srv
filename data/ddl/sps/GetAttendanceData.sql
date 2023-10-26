

CREATE PROCEDURE GetAttendanceData(IN typeId VARCHAR(100), IN page INTEGER, IN pageSize INTEGER)
BEGIN
    DECLARE _offset INT;
    DECLARE _count INT;
    DECLARE _data INT;

    SET _offset = (page -1) * pageSize;

    select count(*) INTO _count
        from `Attendances` INNER JOIN `Employees` on Employees.id = Attendances.`employeeId`
        LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id                         
    where Contracts.isActive = 1 and Attendances.typeId = typeId; 

    select Attendances.startDate, Attendances.endDate,avatar,Employees.code, Departments.code, Departments.name, firstName, lastName, _count as total from `Attendances` 
        INNER JOIN `Employees` on `Employees`.id = `Attendances`.`employeeId` 
        INNER JOIN `Persons` on Employees.id = Persons.`employeeId` 
        LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
        INNER JOIN `Departments` on `Departments`.id = Contracts.`departmentId`
    where Attendances.typeId = typeId and Contracts.isActive = 1 ORDER BY Attendances.`createdAt` limit pageSize OFFSET _offset;
END;

CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff",1, 6);
#CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2022-03-10","DAY");
