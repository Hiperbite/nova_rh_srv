
DROP PROCEDURE GETTOTALWEEKPRESENCE;
CREATE PROCEDURE `GETTOTALWEEKPRESENCE`(IN STARTDATE DATE
, IN ENDDATE DATE)
BEGIN 
	select 	

	

	COUNT(
	        IF(
	            
	                `WorkingHours`.`weekDays` LIKE '%Mo%',
	            1,
	            NULL
	        )
	    ) as mondayCount,
	    COUNT(
	        IF(
	             `WorkingHours`.`weekDays` LIKE  '%Tu%',
	            1,
	            NULL
	        )
	    ) as tuesdayCount,
	    COUNT(
	        IF(
	             `WorkingHours`.`weekDays` LIKE  '%We%',
	            1,
	            NULL
	        )
	    ) as wednesdayCount,
	    COUNT(
	        IF(
	             `WorkingHours`.`weekDays` LIKE  '%Th%',
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
	             `WorkingHours`.`weekDays` LIKE  '%Sa%',
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
	    ) as sundayCount from 
	`WorkingHours`
	LEFT JOIN `Contracts` on Contracts.id=WorkingHours.`contractId` 
	and Contracts.`isActive` is true
	LEFT JOIN `Employees` on Employees.id=Contracts.`employeeId`
	and Employees.`isActive` is true
	;

	END

;
-- 1, 4, 7, 10, 13, 16
	