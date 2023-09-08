-- Active: 1667157413070@@127.0.0.1@3306@nova_rh_2
DROP PROCEDURE GetRolesEmployeesCount;
CREATE PROCEDURE GetRolesEMployeesCount()
BEGIN 
	SELECT
	    count(C.roleId) as quantity,
	    R.*
	FROM Contracts as C
	    INNER JOIN EmployeeRoles as R ON R.id = C.roleId
	GROUP BY C.roleId
	HAVING COUNT(*) >= 1
	ORDER BY quantity DESC
	LIMIT 0, 6;
END; 