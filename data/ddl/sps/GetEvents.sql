SELECT * FROM `Tracks` Where model = "Employee" ORDER BY `updatedAt` DESC LIMIT 10;

CREATE PROCEDURE GetEvents()
    BEGIN
        SELECT * FROM `Tracks` Where model = "Employee" ORDER BY `updatedAt` DESC LIMIT 10;
    END;


CALL GetEvents();