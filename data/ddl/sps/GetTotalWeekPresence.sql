DROP PROCEDURE GETTOTALWEEKPRESENCE;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GETTOTALWEEKPRESENCE`(IN STARTDATE DATE
, IN ENDDATE DATE)
BEGIN 
	SELECT
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Mo%',
	            1,
	            NULL
	        )
	    ) as mondayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Tu%',
	            1,
	            NULL
	        )
	    ) as tuesdayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%We%',
	            1,
	            NULL
	        )
	    ) as wednesdayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Th%',
	            1,
	            NULL
	        )
	    ) as thursdayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Fr%',
	            1,
	            NULL
	        )
	    ) as fridayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Sa%',
	            1,
	            NULL
	        )
	    ) as saturdayCount,
	    COUNT(
	        IF(
	            `workinghours`.`weekDays` LIKE '%Su%',
	            1,
	            NULL
	        )
	    ) as sundayCount
	FROM employees
	    LEFT JOIN attendances on `employees`.`id` = `attendances`.`employeeId`, contracts, workinghours
	where
	    `employees`.`id` = `contracts`.`employeeId`
		and employees.`isActive` = 1
	    and `contracts`.`id` = `workinghours`.`contractId`;
	END