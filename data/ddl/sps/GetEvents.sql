
    SELECT * FROM `Tracks` Where model IN ("Employee", "Attendance", "User")  ORDER BY `updatedAt` DESC LIMIT 10;

CREATE PROCEDURE GetEvents()
    BEGIN
        SELECT * FROM `Tracks` Where model IN ("Employee", "Attendance", "User")  ORDER BY `updatedAt` DESC LIMIT 10;
    END;


CALL GetEvents();