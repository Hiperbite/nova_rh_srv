
DROP PROCEDURE GETWEEKPRESENCEFAULTS;

CREATE DEFINER=`root`@`localhost` PROCEDURE `GETWEEKPRESENCEFAULTS`(IN STARTDATE DATE
, IN ENDDATE DATE)
BEGIN 
	SELECT
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Mo'
	            and DAYOFWEEK(Attendances.`startDate`) = 2,
	            1,
	            NULL
	        )
	    ) as mondayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Tu'
	            and DAYOFWEEK(Attendances.`startDate`) = 3,
	            1,
	            NULL
	        )
	    ) as tuesdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'We'
	            and DAYOFWEEK(Attendances.`startDate`) = 4,
	            1,
	            NULL
	        )
	    ) as wednesdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Th'
	            and DAYOFWEEK(Attendances.`startDate`) = 5,
	            1,
	            NULL
	        )
	    ) as thursdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Fr'
	            and DAYOFWEEK(Attendances.`startDate`) = 6,
	            1,
	            NULL
	        )
	    ) as fridayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Sa'
	            and DAYOFWEEK(Attendances.`startDate`) = 7,
	            1,
	            NULL
	        )
	    ) as saturdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `WorkingHours`.`weekDays`,
	                1,
	                2
	            ) = 'Su'
	            and DAYOFWEEK(Attendances.`startDate`) = 1,
	            1,
	            NULL
	        )
	    ) as sundayCount
	from Attendances
	    LEFT JOIN `Employees` on Attendances.`employeeId` = Employees.id
	    LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id
	    LEFT JOIN WorkingHours on Contracts.id = `WorkingHours`.`contractId`
	WHERE
		(Attendances.`startDate` BETWEEN STARTDATE and ENDDATE) 
		and 
		(Employees.`isActive` = 1)
		and
	    (Attendances.`typeId` = 'f6bcaa60-ee5d-490d-ba0c-d8ca55afa5ca'
	    OR Attendances.`typeId` = '68987a50-8f96-4735-af13-def233140b30');
	END