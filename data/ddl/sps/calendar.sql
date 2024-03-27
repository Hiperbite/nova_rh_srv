-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DROP if EXISTS PROCEDURE GetCalendarDate;

DELIMITER $$

CREATE PROCEDURE GetCalendarDate(IN BEGIN_DATE VARCHAR(100), IN END_DATE VARCHAR(100))
BEGIN
    SELECT
        Employees.id,
        Persons.firstName,
        Persons.otherNames,
        Persons.lastName,
        Employees.code AS code,
        Contracts.startDate AS date,
        SUBSTRING(startDate, 6, 2) AS month,
        1 AS type
    FROM
        Contracts
    INNER JOIN Employees ON Employees.id = Contracts.employeeId
    INNER JOIN Persons ON Persons.employeeId = Employees.id
    WHERE
        SUBSTRING(startDate, 6, 2) = SUBSTRING(begin_date, 6, 2)

    UNION

    SELECT
        Employees.id,
        Persons.firstName,
        Persons.otherNames,
        Persons.lastName,
        Employees.code AS code,
        Persons.birthDate AS date,
        SUBSTRING(birthDate, 6, 2) AS month,
        2 AS type
    FROM
        Employees
    LEFT JOIN Contracts ON Employees.id = Contracts.employeeId
    INNER JOIN Persons ON Persons.employeeId = Employees.id
    WHERE
        SUBSTRING(birthDate, 6, 2) = SUBSTRING(begin_date, 6, 2);
END$$

DELIMITER ;