-- Active: 1667157413070@@127.0.0.1@3306@nova_ri

DELIMITER //

CREATE PROCEDURE GetEvents()
BEGIN
    SELECT *
    FROM `Tracks`
    WHERE model IN ('Employee', 'Attendance', 'Contract')
    ORDER BY `updatedAt` DESC
    LIMIT 10;
END//

DELIMITER ;