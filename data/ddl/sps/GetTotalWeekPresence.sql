
DROP PROCEDURE GETTOTALWEEKPRESENCE;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GETTOTALWEEKPRESENCE`(IN STARTDATE DATE
, IN ENDDATE DATE)
BEGIN 
	SELECT
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Mo%',
	            1,
	            NULL
	        )
	    ) as mondayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Tu%',
	            1,
	            NULL
	        )
	    ) as tuesdayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%We%',
	            1,
	            NULL
	        )
	    ) as wednesdayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Th%',
	            1,
	            NULL
	        )
	    ) as thursdayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Fr%',
	            1,
	            NULL
	        )
	    ) as fridayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Sa%',
	            1,
	            NULL
	        )
	    ) as saturdayCount,
	    COUNT(
	        IF(
	            `WorkingHours`.`weekDays` LIKE '%Su%',
	            1,
	            NULL
	        )
	    ) as sundayCount
	FROM Employees
	    LEFT JOIN Attendances on `Employees`.`id` = `Attendances`.`employeeId`, Contracts, WorkingHours
	where
	    `Employees`.`id` = `Contracts`.`employeeId`
		and Employees.`isActive` = 1
	    and `Contracts`.`id` = `WorkingHours`.`contractId`;
	END