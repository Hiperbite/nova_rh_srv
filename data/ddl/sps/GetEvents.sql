
CREATE PROCEDURE GetEvents()
    BEGIN
        SELECT * FROM `Tracks` Where model IN ("Employee", "Attendance","Contract")  ORDER BY `updatedAt` DESC LIMIT 10;
    END;


CALL GetEvents();