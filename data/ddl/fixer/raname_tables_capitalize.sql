-- Active: 1710171976509@@nova.local.ao@3306@novaloca_rh_demo

SET @sql = NULL;

SELECT GROUP_CONCAT(CONCAT('RENAME TABLE ';

table_name;

' TO ';

UPPER(SUBSTRING(table_name;

1;

1));

LOWER(SUBSTRING(table_name;

2
)
)
)
) INTO @sql
FROM
    information_schema.tables
WHERE
    table_schema = 'novaloca_rh_demo'
    AND table_name IN (
        'accountpaymentdatas';

'additionalfields';

'additionalpayments';

'additionalpaymenttypes';

'address';

'advancepayments';

'attachments';

'attendancejustifications';

'attendances';

'attendancetypes';

'banks';

'business';

'company';

'contacts';

'contacttypes';

'contracts';

'countries';

'currencies';

'departments';

'documents';

'employeecategories';

'employeeroles';

'employees';

'events';

'eventschedules';

'eventtypes';

'favoritefiles';

'files';

'frequencies';

'notifications';

'payrolllines';

'payrolllinetypes';

'payrolls';

'payrollsettings';

'payrollstatus';

'paystubcurrencies';

'paystubs';

'persons';

'rolemodules';

'roles';

'salarypackages';

'sequences';

'sessions';

'tickets';

'ticketstates';

'tickettypes';

'tokens';

'tracks';

'users';

'witaxtables');

select @sql;

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

SET @sql = NULL;

SELECT
    GROUP_CONCAT(
        CONCAT(
            'RENAME TABLE ',
            table_name,
            ' TO ',
            UPPER(SUBSTRING(table_name, 1, 1)),
            LOWER(SUBSTRING(table_name, 2))
        )
    ) INTO @sql
FROM
    information_schema.tables
WHERE
    table_schema = 'novaloca_rh_demo'
    AND table_name IN (
        'accountpaymentdatas',
        'additionalfields',
        'additionalpayments',
        'additionalpaymenttypes',
        'address',
        'advancepayments',
        'attachments',
        'attendancejustifications',
        'attendances',
        'attendancetypes',
        'banks',
        'business',
        'company',
        'contacts',
        'contacttypes',
        'contracts',
        'countries',
        'currencies',
        'departments',
        'documents',
        'employeecategories',
        'employeeroles',
        'employees',
        'events',
        'eventschedules',
        'eventtypes',
        'favoritefiles',
        'files',
        'frequencies',
        'notifications',
        'payrolllines',
        'payrolllinetypes',
        'payrolls',
        'payrollsettings',
        'payrollstatus',
        'paystubcurrencies',
        'paystubs',
        'persons',
        'rolemodules',
        'roles',
        'salarypackages',
        'sequences',
        'sessions',
        'tickets',
        'ticketstates',
        'tickettypes',
        'tokens',
        'tracks',
        'users',
        'witaxtables'
    );

select @sql;

RENAME TABLE company TO Company;

RENAME TABLE employeeroles TO EmployeeRoles;

RENAME TABLE tokens TO Tokens;

RENAME TABLE business TO Business;

RENAME TABLE tickets TO Tickets;

RENAME TABLE additionalpaymenttypes TO AdditionalPaymentTypes;

RENAME TABLE attachments TO Attachments;

RENAME TABLE attendances TO Attendances;

RENAME TABLE rolemodules TO RoleModules;

RENAME TABLE advancepayments TO AdvancePayments;

RENAME TABLE documents TO Documents;

RENAME TABLE address TO Address;

RENAME TABLE ticketstates TO TicketStates;

RENAME TABLE paystubcurrencies TO Paystubcurrencies;

RENAME TABLE paystubs TO PayStubs;

RENAME TABLE attendancejustifications TO AttendanceJustifications;

RENAME TABLE countries TO Countries;

RENAME TABLE users TO Users;

RENAME TABLE notifications TO Notifications;

RENAME TABLE files TO Files;

RENAME TABLE favoritefiles TO FavoriteFiles;

RENAME TABLE roles TO Roles;

RENAME TABLE persons TO Persons;

RENAME TABLE frequencies TO Frequencies;

RENAME TABLE employees TO Employees;

RENAME TABLE eventschedules TO EventSchedules;

RENAME TABLE payrolllines TO PayrollLines;

RENAME TABLE sequences TO Sequences;

RENAME TABLE payrolllinetypes TO PayrollLineTypes;

RENAME TABLE additionalfields TO AdditionalFields;

RENAME TABLE employeecategories TO EmployeeCategories;

RENAME TABLE currencies TO Currencies;

RENAME TABLE events TO Events;

RENAME TABLE eventtypes TO EventTypes;

RENAME TABLE witaxtables TO WITaxTables;

RENAME TABLE accountpaymentdatas TO AccountPaymentDatas;

RENAME TABLE departments TO Departments;

RENAME TABLE tracks TO Tracks;

RENAME TABLE attendancetypes TO AttendanceTypes;

RENAME TABLE additionalpayments TO AdditionalPayments;

RENAME TABLE contracts TO Contracts;

RENAME TABLE salarypackages TO SalaryPackages;

RENAME TABLE sessions TO Sessions;

RENAME TABLE contacts TO Contacts;

RENAME TABLE contacttypes TO ContactTypes;

RENAME TABLE banks TO Banks;

RENAME TABLE payrollsettings TO PayrollSettings;

RENAME TABLE payrolls TO Payrolls;

RENAME TABLE payrollstatus TO PayrollStatus;

RENAME TABLE tickettypes TO TicketTypes ;