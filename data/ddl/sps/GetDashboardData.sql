-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DROP if exists PROCEDURE GETDASHBOARDDATA;
DELIMITER $$


CREATE PROCEDURE `GETDASHBOARDDATA`()
BEGIN
    DECLARE avgAge DECIMAL(10,2);
    DECLARE countMan INT;
    DECLARE countWoman INT;
    DECLARE lastStartDate INT;
    DECLARE lastEndDate INT;
    DECLARE avgBaseValue DECIMAL(10,2);

    -- Calculate average age
    SELECT ROUND(AVG(TIMESTAMPDIFF(YEAR, p.`birthDate`, NOW())), 2) INTO avgAge
    FROM Persons p
    INNER JOIN Employees e ON p.employeeId = e.id
    INNER JOIN Contacts x ON x.employeeId = e.id
    WHERE p.isActive = TRUE AND x.isActive = TRUE;

    -- Count male persons
    SELECT COUNT(*) INTO countMan
    FROM Persons
    WHERE gender = 'M';

    -- Count female persons
    SELECT COUNT(*) INTO countWoman
    FROM Persons
    WHERE gender = 'W';

    -- Calculate last start date
    SELECT TIMESTAMPDIFF(MONTH, MIN(c.`startDate`), NOW()) INTO lastStartDate
    FROM Contracts c
    WHERE c.`isActive` = TRUE AND c.`startDate` < NOW();

    -- Calculate last end date
    SELECT TIMESTAMPDIFF(MONTH, MAX(c.`endDate`), NOW()) INTO lastEndDate
    FROM Contracts c
    WHERE c.`isActive` = TRUE AND c.`startDate` < NOW();

    -- Calculate average base value
    SELECT ROUND(AVG(s.`baseValue`), 2) INTO avgBaseValue
    FROM `SalaryPackages` s
    LEFT JOIN Contracts c ON c.id = s.`contractId`
    WHERE c.`isActive` = TRUE AND s.`isActive` = TRUE AND c.`startDate` < NOW() AND c.endDate > NOW();

    -- Return dashboard data
    SELECT avgAge, countMan, countWoman, lastStartDate, lastEndDate, avgBaseValue;
END$$

DELIMITER ;


