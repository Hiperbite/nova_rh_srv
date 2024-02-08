import moment from "moment";

export default class VacationApp {


    // Function to calculate total vacation balance for multiple contracts
    static calculateTotalVacationBalance = (contracts: { startDate: string; endDate: string }[]): number => {
        let totalBalance = 0;

        for (const contract of contracts) {
            const startDate = moment(contract.startDate);
            const endDate = moment(contract.endDate);
            if (moment().startOf('year').isAfter(endDate)) {

            }
            // Calculate the difference in months for each contract
            const monthsWorked = endDate.diff(startDate, 'months');

            // Calculate the vacation balance for each contract in days
            const vacationBalance = monthsWorked * 2;

            // Accumulate the balance for each contract
            totalBalance += vacationBalance;
        }

        return totalBalance;
    }

    // Function to check if vacations were taken within the deadline for multiple contracts
    static checkVacationUsage = (contracts: { start: string; end: string }[]): boolean => {
        for (const contract of contracts) {
            const contractEndDate = moment(contract.end);
            const vacationUsageDeadline = moment(contract.start).add(3, 'months');

            // Check if the vacation deadline is met for each contract
            if (!contractEndDate.isBefore(vacationUsageDeadline)) {
                return false;
            }
        }

        return true;
    }


}   // Example of usage with three contracts
