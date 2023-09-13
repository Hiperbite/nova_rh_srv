-- Active: 1693394289042@@127.0.0.1@3306@nova_rh
DROP PROCEDURE GETDASHBOARDDATA;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GETDASHBOARDDATA`()
BEGIN
    SELECT  ROUND(AVG(TIMESTAMPDIFF(YEAR, `birthDate`, NOW()))) AS avgAge, 
        (SELECT COUNT(*) FROM `Persons` WHERE gender="M" OR gender="Man") as countMan,
        (SELECT COUNT(*) as female FROM `Persons` WHERE gender="F" OR gender="Woman") as countWoman,
        (SELECT MIN(`createdAt`) FROM `Employees`) as firstDate,
        (SELECT MAX(`createdAt`) FROM `Employees`) as lastDate,
        (SELECT ROUND(AVG(s.`baseValue`)) from `SalaryPackages` s left join Contracts c on c.id = s.`contractId` where c.`isActive` = true and s.`isActive` = true and c.`startDate` < NOW() and c.endDate > NOW()) as avgBaseValue
    FROM `Persons`;
END;

CALL `GETDASHBOARDDATA`();
