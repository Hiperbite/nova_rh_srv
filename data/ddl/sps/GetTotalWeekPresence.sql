-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DROP PROCEDURE GETTOTALWEEKPRESENCE;
DELIMITER //

CREATE PROCEDURE `GETTOTALWEEKPRESENCE`(IN STARTDATE DATE, IN ENDDATE DATE)
BEGIN 
    SELECT 		
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE '%Mo%',
                1,
                NULL
            )
        ) AS mondayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE  '%Tu%',
                1,
                NULL
            )
        ) AS tuesdayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE  '%We%',
                1,
                NULL
            )
        ) AS wednesdayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE  '%Th%',
                1,
                NULL
            )
        ) AS thursdayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE '%Fr%',
                1,
                NULL
            )
        ) AS fridayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE  '%Sa%',
                1,
                NULL
            )
        ) AS saturdayCount,
        COUNT(
            IF(
                `WorkingHours`.`weekDays` LIKE '%Su%',
                1,
                NULL
            )
        ) AS sundayCount 
    FROM 
        `WorkingHours`
    LEFT JOIN 
        `Contracts` ON Contracts.id = WorkingHours.contractId 
        AND Contracts.isActive = TRUE
    LEFT JOIN 
        `Employees` ON Employees.id = Contracts.employeeId
        AND Employees.isActive = TRUE
    WHERE 
        WorkingHours.workDate BETWEEN STARTDATE AND ENDDATE;
END//

DELIMITER ;

-- 1, 4, 7, 10, 13, 16
	