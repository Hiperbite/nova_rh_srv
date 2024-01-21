-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DELIMITER //
DROP PROCEDURE GETWEEKPRESENCEFAULTS;
-- Active: 1667157413070@@127.0.0.1@3306@nova_rh
CREATE  PROCEDURE `GETWEEKPRESENCEFAULTS`(IN STARTDATE DATE
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 1,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 2,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 3,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 4,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 5,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 6,
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
	            and (DAYOFWEEK(Attendances.`startDate`) - 1) = 0,
	            1,
	            NULL
	        )
	    ) as sundayCount
	from Attendances
	    LEFT JOIN `Employees` on Attendances.`employeeId` = Employees.id
	    LEFT JOIN `Contracts` on Contracts.`employeeId` = Employees.id 
				
	    LEFT JOIN WorkingHours on Contracts.id = `WorkingHours`.`contractId`
		LEFT JOIN AttendanceTypes on AttendanceTypes.id=Attendances.typeId 
				and (AttendanceTypes.code='ABSENT' or AttendanceTypes.code='VACATION')
	WHERE
		(Attendances.`startDate` BETWEEN STARTDATE and ENDDATE) 
		and Employees.`isActive` = 1
		and Contracts.`isActive`  is true;
	END;
	//