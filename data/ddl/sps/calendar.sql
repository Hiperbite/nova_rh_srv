-- Active: 1667157413070@@127.0.0.1@3306@nova_rh_2
DROP PROCEDURE GetCallendarDate;
CREATE  PROCEDURE GetCallendarDate(IN begin_date VARCHAR(100), IN end_date VARCHAR(100))
BEGIN
	select 
		concat(persons.firstName,' ',persons.lastName) as fullname, "2" as code, 
		concat(persons.firstName,' ',persons.lastName, ' inicio de contracto') as title, "Contracto" as subject,
        "info" as className, date_format(startDate, "%Y-%m-%d") as start, " " as end, endDate from contracts 
		inner join employees on employees.id = contracts.employeeId inner join persons on persons.employeeId = employees.id where startDate between begin_date and end_date
	union 
	select 
    concat(firstName," ",lastName) as fullname, "1" as code,
    concat(firstName," ",lastName, " aniversário") as title, 
    "Aniversário" as subject, "success" as className, concat(LEFT(NOW(),4),RIGHT(birthDate,6)) as start, concat(LEFT(NOW(),4),RIGHT(birthDate,6)) as end, " " as endDate from persons where RIGHT(birthDate,5) between RIGHT(begin_date,5) and RIGHT(end_date,5);
END ;
