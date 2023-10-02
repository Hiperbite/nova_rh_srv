CREATE PROCEDURE GetAttendance
BEGIN
#comparação por dia
select `Attendances`.employeeId, startDate ,endDate, avatar,code, firstName, lastName, typeId from `Attendances` 
    inner join `Employees` on `Employees`.id = `Attendances`.`employeeId` 
    inner join `Persons` on Employees.id = Persons.`employeeId` 
where Attendances.typeId = "46f04abc-05f4-4a15-aaea-3e94cc82b8ff" and DATE(Attendances.startDate) = DATE("2022-03-10");


#comparação por mês
select startDate ,endDate, avatar,code, firstName, lastName, typeId from `Attendances` 
    inner join `Employees` on `Employees`.id = `Attendances`.`employeeId` 
    inner join `Persons` on Employees.id = Persons.`employeeId` 
where Attendances.typeId = "46f04abc-05f4-4a15-aaea-3e94cc82b8ff" and LEFT(DATE("2022-03-10"),7) = LEFT(Attendances.startDate,7);

SELECT LEFT(DATE("2022-03-10"),7) = LEFT("2022-03-10 20:02:01",7);
END;


SELECT * FROM `Employees`;
SELECT * FROM `Departments`;
SELECT * FROM `Contracts`;
select * from `Attendances`;