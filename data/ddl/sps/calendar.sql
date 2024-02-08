-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DROP PROCEDURE GetCalendarDate;



CREATE PROCEDURE GetCalendarDate(IN BEGIN_DATE VARCHAR(100),IN end_date VARCHAR(100))

BEGIN
	select
	    
			Employees.id,
	        Persons.firstName,
			Persons.otherNames,
	        Persons.lastName,
	    	Employees.code as code,
	    	Contracts.startDate as date,
			SUBSTRING(startDate, 6, 2) as month,
			1 as type	   
	from Contracts
	    inner join Employees on Employees.id = Contracts.employeeId
	    inner join Persons on Persons.employeeId = Employees.id
	where
	 SUBSTRING(startDate, 6, 2) = SUBSTRING(begin_date, 6, 2)
	 --   startDate between begin_date and end_date
	union
	select
	    
			Employees.id,
	        Persons.firstName,
			Persons.otherNames,
	        Persons.lastName,
	    	Employees.code as code,
	    	Persons.birthDate as date,
			SUBSTRING(birthDate, 6, 2) as month,
			2 as type	   
	from Employees
	    left join Contracts on Employees.id = Contracts.employeeId
	    inner join Persons on Persons.employeeId = Employees.id
	where
	SUBSTRING(birthDate, 6, 2) = SUBSTRING(begin_date, 6, 2)
	  --  birthDate between begin_date and end_date
	;
END
