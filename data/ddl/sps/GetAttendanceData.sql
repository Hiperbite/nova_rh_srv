
-- Active: 1667157413070@@127.0.0.1@3306@nova_ri
DELIMITER $$

CREATE PROCEDURE GetAttendanceData(IN typeId VARCHAR(100), IN page INTEGER, IN pageSize INTEGER)
BEGIN
    DECLARE _offset INT;
    DECLARE _count INT;

    SET _offset = (page - 1) * pageSize;

    -- Calculate total count of records
    SELECT COUNT(*) INTO _count
    FROM `Attendances`
    INNER JOIN `Employees` ON Employees.id = Attendances.`employeeId`
    LEFT JOIN `Contracts` ON Contracts.`employeeId` = Employees.id
    WHERE Contracts.isActive = 1 AND Attendances.typeId = typeId;

    -- Fetch attendance data
    SELECT Attendances.startDate, Attendances.endDate, Employees.avatar, Employees.code AS employeeCode, Departments.code AS departmentCode, Departments.name AS departmentName, Persons.firstName, Persons.lastName, _count AS total
    FROM `Attendances`
    INNER JOIN `Employees` ON Employees.id = Attendances.`employeeId`
    INNER JOIN `Persons` ON Employees.id = Persons.`employeeId`
    LEFT JOIN `Contracts` ON Contracts.`employeeId` = Employees.id
    INNER JOIN `Departments` ON Departments.id = Contracts.`departmentId`
    WHERE Attendances.typeId = typeId AND Contracts.isActive = 1
    ORDER BY Attendances.`createdAt`
    LIMIT pageSize OFFSET _offset;
END$$

DELIMITER ;

CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff",1, 6);
#CALL `GetAttendanceData`("46f04abc-05f4-4a15-aaea-3e94cc82b8ff","2022-03-10","DAY");
