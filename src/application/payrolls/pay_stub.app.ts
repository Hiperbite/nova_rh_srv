import { includes } from 'lodash';
import { AdditionalPaymentType, AdvancePayment, Contract, PayrollLine, PayStub, SalaryPackage } from "../../models/index";
import moment from "moment";
import WITaxApp from "./wi_tax.app";
import payrollApi from "api/payrolls/payroll.api";
import { Op } from "sequelize";

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


            const contract = await Contract.findByPk(payStub?.contractId);

            const advancePaymentDate = moment().set('year', payStub?.year ?? 2000).set('month', (payStub?.month ?? 1)-1)

            const advancePaymentsAdds: AdvancePayment[] = await AdvancePayment.findAll({
                where: {
                    employeeId: contract?.employeeId,
                    date: { [Op.between]: [advancePaymentDate.startOf('month').toDate(), advancePaymentDate.endOf('month').toDate()] }
                }, include: { all: true }
            });

            if (advancePaymentsAdds?.length > 0) {
                let additionalPaymentType = await AdditionalPaymentType.findByPk('53f8b609-21f2-4f53-99df-4db73100a52e')

                for (let payment of advancePaymentsAdds) {
                    const num = (payment?.payrollLines?.filter((p: PayrollLine) => p?.debit)?.length ?? 0)
                    if (num === 0)
                        lines.push({
                            isActive: true,
                            code: additionalPaymentType?.code,
                            date: new Date(),
                            value: payment?.amount,
                            debit: true,
                            quantity: 1,
                            baseValuePeriod: salaryPackage?.baseValuePeriod,
                            descriptions: additionalPaymentType?.name + `[${moment(payment?.date).format('MM/YYYY')}]`,
                            advancePaymentId: payment?.id
                        })
                }


            }

            const grossValue: number = lines?.map((x: any) => Number(x?.value))?.reduce((x: any, y: any) => x + y)

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


            const advancePaymentsRms: AdvancePayment[] = await AdvancePayment.findAll({
                where: {
                    employeeId: contract?.employeeId,
                    startDate: { [Op.lte]: advancePaymentDate.toDate() },
                    endDate: { [Op.gte]: advancePaymentDate.toDate() },
                }
                , include: { all: true }
            });

            if (advancePaymentsRms?.length > 0) {

                let additionalPaymentType = await AdditionalPaymentType.findByPk('53f8b609-21f2-4f53-99df-4db73100a52e')

                for (let payment of advancePaymentsRms) {
                    const num = (payment?.payrollLines?.filter((p: PayrollLine) => !p?.debit)?.length ?? 0) + 1
                    lines.push({
                        isActive: true,
                        code: additionalPaymentType?.code,
                        date: new Date(),
                        value: payment?.amountPerInstallment,
                        debit: false,
                        quantity: 1,
                        baseValuePeriod: salaryPackage?.baseValuePeriod,
                        descriptions: additionalPaymentType?.name + ` - ${num}º ` + ` [${moment(payment?.date).format('MM/YYYY')}]`,
                        advancePaymentId: payment?.id
                    })
                }


            }

            for (let line of lines)
                await PayrollLine.create({ ...line, payStubId: payStub?.id }, { transaction })



        } catch (error: any) {
            let u = error
        }
    }
}