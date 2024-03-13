import { Address, Company, Contract, Payroll, PayrollLine, PayStub, Procedure, SalaryPackage, SPs, User } from "../../models/index";
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
    static generateSocialSecurityMapReportXML = async (payrolId: string, type: number = 0, user: User | null) => {



        const company = await Company.findOne();

        const payroll: Payroll | null = await Payroll.scope('default').findByPk(payrolId);

        const { date }: any = payroll;

        const year = moment(date).format('YYYY'),
            month = moment(date).format('MM');

        const _fileName: string = [
            (company?.socialSecurityNumber ?? '')?.padEnd(4, '0'),
            year,
            month,
            type.toString(),
        ].join('')

        const _fileHeader: Array<string> = [
            // Indicador do Tipo de Registro
            '00',
            //Data de Referência (Guia de Pagamento)
            '01' + month.toString().padStart(2, '0') + year.toString().padStart(4, '0'),
            //Tipo do Ficheiro (N-Normal / C-Complementar)
            'N',
            //Número de Inscrição da Empresa no INSS
            (company?.socialSecurityNumber ?? '').substring(0, 9).padEnd(9, ' '),
            //Número de Inscrição da Empresa no INSS (Novo)
            (company?.socialSecurityNewNumber ?? '').substring(0, 20).padStart(20, '0'),
            //Número do Contribuinte no Ministério das Finanças
            (company?.nif ?? '')?.padStart(20, '0'),
            //Nome da empresa
            (company?.name?.toUpperCase()?.substring(0, 70) ?? '').padEnd(70, ' '),
            //Código do Município
            ''.padEnd(5, ' '),
            //Espaços em Branco
            ''.padEnd(44, ' ')
        ]

        let _totalRows = 0;
        let _totalAmounts = 0;
        let _totalOtherAmounts = 0;
        const genLine = (payStub: PayStub) => {

            _totalRows++;

            _totalAmounts += Number(payStub?.lines?.find(({ code }: any) => code === '1000')?.value);

            _totalOtherAmounts += Number(
                payStub
                    ?.lines
                    ?.filter(({ code }: any) => code !== '1000')
                    ?.map(({ value }: any) => value)
                    ?.reduce((a: number, b: number) => Number(a) + Number(b), 0),
            );

            const contracts: Array<Contract> =
                _.
                    sortBy(payStub
                        ?.contract
                        ?.employee
                        ?.contracts, ['startDate'])

            const firstContract: Contract | undefined = _.first(contracts);
            const lastContract: Contract | undefined = _.last(contracts);

            return [
                //Indicador do Tipo de Registro
                '10',
                //Número de Inscrição do Segurado no INSS
                (payStub?.contract?.employee?.person?.socialSecurityNumber ?? '')?.padStart(9, '0'),
                //Número de Inscrição do Segurado no INSS(NOVO)
                (payStub?.contract?.employee?.person?.socialSecurityNumber ?? '')?.padStart(20, '0'),

                //Nome do Funcionário (Segurado)
                payStub?.contract?.employee?.person?.fullName.toUpperCase()?.padEnd(70, ' '),

                //TODO: Código da Categoria Profissional
                payStub?.contract?.role?.name?.substring(0, 5)?.toUpperCase(),

                //Valor do Salário Base
                payStub?.lines?.find(({ code }: any) => code === '1000')?.value.toString().substring(0, 14).replace('.', '').padStart(14, '0'),
                //Valor Outras Remunerações Adicionais
                payStub?.lines?.filter(({ code }: any) => code !== '1000')?.map(({ value }: any) => value)?.reduce((a: number, b: number) => Number(a) + Number(b), 0).toString().substring(0, 14).replace('.', '').padStart(14, '0'),
                //TODO: Inicio do Vínculo
                moment(firstContract?.startDate).format('DDMMYYYY'),
                //TODO: FIm do Vínculo
                moment(lastContract?.endDate).format('DDMMYYYY')
            ]
        }


        const _fileLines: Array<String> = payroll?.payStubs?.map(genLine)?.map((a: string[]) => a.join('')) ?? [];

        const _fileFooter = [

            //Indicador do Tipo de Registo
            '99',
            //Número Total de Registos do Tipo 10
            _totalRows.toString().padStart(10, '0'),
            //Preencher com zeros
            ''.padEnd(10, '0'),
            //Soma do Campo "Valor do Salário Base"
            _totalAmounts.toString().replace('.', '').toString().padStart(14, '0'),
            //Soma do Campo "Valor Outras Remunerações Adicionais"
            _totalOtherAmounts.toString().replace('.', '').toString().padStart(14, '0'),
            //Nome Do Responsável Pela Geração Do Ficheiro
            'abcd efgh'.substring(40).padEnd(40, ' '),
            //E-Mail Do Responsável Pela Geração Do Ficheiro
            user?.email?.padEnd(50, ' '),
            //Espaços em Branco
            ''.padEnd(40, ' ')
        ]



        const final = [
            [_fileHeader.join(''), ..._fileLines, _fileFooter?.join('')].join('\n'), 'text/plain', _fileName];

        return final;

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