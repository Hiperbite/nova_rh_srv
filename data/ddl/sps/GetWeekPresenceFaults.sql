-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DELIMITER //
DROP PROCEDURE GETWEEKPRESENCEFAULTS;
-- Active: 1667157413070@@127.0.0.1@3306@nova_rh
DELIMITER //

CREATE PROCEDURE `GETWEEKPRESENCEFAULTS`(IN STARTDATE DATE, IN ENDDATE DATE)
BEGIN 
    SELECT
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Mo'
                AND DAYOFWEEK(Attendances.`startDate`) = 2,
                1,
                NULL
            )
        ) AS mondayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Tu'
                AND DAYOFWEEK(Attendances.`startDate`) = 3,
                1,
                NULL
            )
        ) AS tuesdayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'We'
                AND DAYOFWEEK(Attendances.`startDate`) = 4,
                1,
                NULL
            )
        ) AS wednesdayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Th'
                AND DAYOFWEEK(Attendances.`startDate`) = 5,
                1,
                NULL
            )
        ) AS thursdayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Fr'
                AND DAYOFWEEK(Attendances.`startDate`) = 6,
                1,
                NULL
            )
        ) AS fridayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Sa'
                AND DAYOFWEEK(Attendances.`startDate`) = 7,
                1,
                NULL
            )
        ) AS saturdayCount,
        COUNT(
            IF(
                SUBSTRING(
                    `WorkingHours`.`weekDays`,
                    1,
                    2
                ) = 'Su'
                AND DAYOFWEEK(Attendances.`startDate`) = 1,
                1,
                NULL
            )
        ) AS sundayCount
    FROM 
        Attendances
    LEFT JOIN 
        `Employees` ON Attendances.`employeeId` = Employees.id
    LEFT JOIN 
        `Contracts` ON Contracts.`employeeId` = Employees.id 
    LEFT JOIN 
        WorkingHours ON Contracts.id = `WorkingHours`.`contractId`
    LEFT JOIN 
        AttendanceTypes ON AttendanceTypes.id = Attendances.typeId 
                        AND (AttendanceTypes.code = 'ABSENT' OR AttendanceTypes.code = 'VACATION')
    WHERE
        (Attendances.`startDate` BETWEEN STARTDATE AND ENDDATE) 
        AND Employees.`isActive` = 1
        AND Contracts.`isActive`  = true;
END//

DELIMITER ;