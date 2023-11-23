-- Active: 1667157413070@@127.0.0.1@3306@nova_rh
DROP PROCEDURE GETDASHBOARDDATA;
CREATE PROCEDURE `GETDASHBOARDDATA`()
BEGIN
    
SELECT  ROUND(AVG(TIMESTAMPDIFF(YEAR, p.`birthDate`, NOW()))) AS avgAge, 
        (SELECT COUNT(*) FROM `Persons` WHERE gender="M" ) as countMan,
        (SELECT COUNT(*) as female FROM `Persons` WHERE gender="W") as countWoman,
        (SELECT (TIMESTAMPDIFF(MONTH, MIN(c.`startDate`), NOW())) FROM Contracts c where  c.`isActive` = true and c.`startDate` < NOW()) as lastDate,
        (SELECT (TIMESTAMPDIFF(MONTH, MAX(c.`startDate`), NOW())) FROM Contracts c where  c.`isActive` = true and c.`startDate` < NOW()) as lastDate,
        (SELECT ROUND(AVG(s.`baseValue`)) from `SalaryPackages` s left join Contracts c on c.id = s.`contractId` where c.`isActive` = true and s.`isActive` = true and c.`startDate` < NOW() and c.endDate > NOW()) as avgBaseValue
    FROM Persons p
    INNER join Employees e
    on p.employeeId=e.id
    INNER join Contacts x
    on x.employeeId=e.id
    where p.isActive is true 
    and x.isActive is TRUE
;
END;

CALL `GETDASHBOARDDATA`();

