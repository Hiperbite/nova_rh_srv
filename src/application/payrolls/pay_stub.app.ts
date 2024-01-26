import { PayrollLine, PayStub, SalaryPackage } from "../../models/index";
import moment from "moment";
import WITaxApp from "./wi_tax.app";
import payrollApi from "api/payrolls/payroll.api";

export default class PayStubApp {


    static afterCreatePayStub = async (payStub: PayStub, { transaction }: any = { transaction: null }) => {
        try {
            
            const salaryPackage: any = await SalaryPackage.findOne({ where: { contractId: payStub?.contractId } })// payStub?.contract?.salaryPackage
            const additionalPayments: any = salaryPackage?.additionalPayments

            let lines: any[] =

                additionalPayments?.
                    filter(({ isActive }: any) => isActive).
                    filter(({ startDate }: any) => moment(payStub?.date).isAfter(moment(startDate))).
                    map(({ code, descriptions, startDate, isActive, baseValue, baseValuePeriod, type }: any) => (
                        {
                            isActive,
                            code: type?.code,
                            date: new Date(),
                            descriptions: type?.name,
                            startDate,
                            value: Number(baseValue),
                            property: 1,
                            debit: true,
                            baseValuePeriod,
                            typeId: type?.id
                        }
                    )
                    ) ?? [];

            try {
                lines.push({
                    isActive: true,
                    code: '1000',
                    date: new Date(),
                    value: Number(salaryPackage?.baseValue),
                    debit: true,
                    quantity: 1,
                    baseValuePeriod: salaryPackage?.baseValuePeriod,
                    descriptions: 'Base',

                })
            } catch (e: any) {

                let u = e;
            }
            if (payStub.contractId === '22ad6154-2eb2-455f-884e-463d72e34792') {
                let u = 0;
            }
            const grossValue: number = lines?.map((x: any) => Number(x?.value))?.reduce((x: any, y: any) => x + y)
            if (payStub?.contractId === "cc298b5a-28f1-4a1c-bc4e-ed956e3fb574") {
                let ui = 0;
            }

            const { excess, rate, fixedInstallment, witValue, ssValue } = await WITaxApp.calculator(lines)
            if (grossValue > 70000) {
                lines.push({
                    isActive: true,
                    code: '401',
                    date: new Date(),
                    value: witValue,
                    debit: false,
                    quantity: 1,
                    baseValuePeriod: salaryPackage?.baseValuePeriod,
                    descriptions: `IRT [${rate}%]`,

                })
            }

            lines.push({
                isActive: true,
                code: '350',
                date: new Date(),
                value: ssValue,
                debit: false,
                quantity: 1,
                baseValuePeriod: salaryPackage?.baseValuePeriod,
                descriptions: 'INSS [3%]'
            })

            const deductionValue = lines.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((x: any, y: any) => Number(x) + Number(y));
            const netValue = grossValue - deductionValue;

            for (let line of lines)
                await PayrollLine.create({ ...line, payStubId: payStub?.id }, { transaction })


        } catch (error: any) {
            let u = error
        }
    }
}