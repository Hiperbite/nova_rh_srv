-- Active: 1693908954484@@127.0.0.1@3306@nova_rh
DROP PROCEDURE GETWEEKPRESENCEFAULTS;

CREATE DEFINER=`root`@`localhost` PROCEDURE `GETWEEKPRESENCEFAULTS`(IN STARTDATE DATE
, IN ENDDATE DATE)
BEGIN 
	SELECT
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Mo'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 1,
	            1,
	            NULL
	        )
	    ) as mondayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Tu'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 2,
	            1,
	            NULL
	        )
	    ) as tuesdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'We'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 3,
	            1,
	            NULL
	        )
	    ) as wednesdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Th'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 4,
	            1,
	            NULL
	        )
	    ) as thursdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Fr'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 5,
	            1,
	            NULL
	        )
	    ) as fridayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Sa'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 6,
	            1,
	            NULL
	        )
	    ) as saturdayCount,
	    COUNT(
	        IF(
	            SUBSTRING(
	                `workinghours`.`weekDays`,
	                1,
	                2
	            ) = 'Su'
	            and (DAYOFWEEK(attendances.`startDate`) - 1) = 0,
	            1,
	            NULL
	        )
	    ) as sundayCount
	from attendances
	    LEFT JOIN `employees` on attendances.`employeeId` = employees.id
	    LEFT JOIN `Contracts` on Contracts.`employeeId` = employees.id
	    LEFT JOIN workinghours on Contracts.id = `workinghours`.`contractId`
	WHERE
		(attendances.`startDate` BETWEEN STARTDATE and ENDDATE) 
		and 
		(employees.`isActive` = 1)
		and
	    (attendances.`typeId` = 'f6bcaa60-ee5d-490d-ba0c-d8ca55afa5ca'
	    OR attendances.`typeId` = '68987a50-8f96-4735-af13-def233140b30');
	END