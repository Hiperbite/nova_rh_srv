-- Active: 1667157413070@@127.0.0.1@3306@nova_ri
DROP PROCEDURE GetRolesEmployeesCount;
DELIMITER //

CREATE PROCEDURE GetRolesEmployeesCount()
BEGIN
    SELECT
        COUNT(C.roleId) AS quantity,
        R.*
    FROM 
        Contracts AS C
    INNER JOIN 
        EmployeeRoles AS R ON R.id = C.roleId
    GROUP BY 
        C.roleId
    HAVING 
        COUNT(*) >= 1
    ORDER BY 
        quantity DESC
    LIMIT 6;
END//

DELIMITER ;