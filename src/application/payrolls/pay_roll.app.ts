import { Address, Company, PayrollLine, PayStub, Procedure, SalaryPackage, SPs } from "../../models/index";
import moment from "moment";
import WITaxApp from "./wi_tax.app";

import { json2xml } from 'xml-js';
import _ from "lodash";


export default class PayRollApp {

    static generateWiTaxReportXML = async (year: number, month: number) => {



        const rolesEmployeesCount = await Procedure(SPs.GetWiTAX, [year, month]);

        const company = await Company.findOne();

        const [address]: Address[] = company?.address ?? [];
        const groupedPayStubs: any = _.
            chain(rolesEmployeesCount).
            groupBy('strNifFuncionario')
            .map((x) => {

                const {
                    strNumSS,
                    strNomeFuncionario,
                    strNifFuncionario,
                    baseValue,
                }: any = x[0]
                return {
                    strNifFuncionario,
                    strNomeFuncionario,
                    strNumSS,
                    strProvincia: address?.province,
                    strMunicipio: address?.city,
                    rendimentoAnual: baseValue * 12,
                    totalDoImpostoPago: x?.map((r: any) => r.totalDoImpostoPago)?.reduce((r: number, s: number) => r + s, 0)
                }
            }).value()
        const wiTaxData = {
            'MapaRemuneracoes': {
                'AgenteRetencao': {
                    'strNifAgente': company?.nif,
                    'strAno': year
                },
                'Remuneracao': groupedPayStubs


            }
        };
        const json = JSON.stringify(wiTaxData);

        const xml = json2xml(json, { compact: true, spaces: 4 });

        return xml;

    }

    static afterCreatePayStub = async (payStub: PayStub, { transaction }: any = { transaction: null }) => {

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
                        typeId: type?.id,
                        category: type?.category
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

        const { excess, rate, fixedInstallment, witValue, ssValue } = await WITaxApp.calculator(lines)
        if (witValue > 0) {
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

    }
}