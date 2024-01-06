-- Active: 1667157413070@@127.0.0.1@3306@nova_rh

DELIMITER //

DROP PROCEDURE GetWiTax;

-- Active: 1667157413070@@127.0.0.1@3306@nova_rh

CREATE PROCEDURE `GETWITAX`(IN YEAR INT, IN MONTH INT
) BEGIN 
	SELECT
	    DISTINCT(prl.id),
	    prl.value as totalDoImpostoPago,
	    p.`socialSecurityNumber` as strNumSS,
	    concat(
	        p.`firstName`,
	        ' ',
	        p.`otherNames`,
	        ' ',
	        p.`lastName`
	    ) as strNomeFuncionario,
	    d.number as strNifFuncionario,
	    s.`baseValue`,
	    s.`baseValuePeriod`,
	    d.type,
	    prl.descriptions,
	    prl.code
	FROM `PayrollLines` prl
	    left join `PayStubs` ps ON ps.id = prl.`payStubId` 
		left join `Payrolls` pr on pr.id=ps.`payrollId` and pr.state > 2
	    left join `Contracts` c on c.id = ps.`contractId`
	    left join `Employees` e on c.`employeeId` = e.id
	    left join `SalaryPackages` s on s.`contractId` = c.id
	    left join `Persons` p on p.`employeeId` = e.id
	    left join `Documents` d on d.`employeeId` = e.id and d.`isActive` and d.type = 'IDCARD'
	where
	    ps.year = YEAR
	    and prl.code = '401';
	END // 
