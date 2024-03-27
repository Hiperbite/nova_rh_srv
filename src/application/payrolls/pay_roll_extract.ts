
import moment from "moment";
import { AccountPaymentData, Company, Payroll, PayrollLine, PayStub } from "../../models/index";

import XLSX from "xlsx";

import XLSX2 from "xlsx-js-style";
import { AccessDeniedError, Op, UUID } from "sequelize";
import { PayStubLineTypeConst } from "./pay_stub_line.app";
import { currency } from "../../application/common/docs-generate/document.app";

type PayStubDataType = {
    fullName: string | undefined,
    iban: string | undefined,
    value: string | undefined,
    descriptions: string | undefined,
    address: string | undefined,
    swift: string | undefined
}

class PayRollExtract {

    static generate = async (type: string, payroll: Payroll) => {


        const name = '28' + String(payroll?.month)?.padStart(2, '0') + '' + String(payroll?.year) + 'Ordenado';

        const payStubs = await PayStub.scope('xfull').findAll({ where: { payrollId: payroll.id } });
        const [company] = await Company.findAll();

        const [bankAccount] = await AccountPaymentData.findAll({
            where:
            {
                employeeId: {
                    [Op.eq]: null
                },
                isActive: true
            }
        })

        const payStubData: PayStubDataType[] = payStubs?.map((payStub: PayStub) => {

            const account = payStub?.contract?.employee?.accounts.find(() => true);
            return {
                fullName: payStub?.contract?.employee?.person?.fullName,
                iban: account?.iban,
                value: parseFloat(String(payStub?.netValue)).toFixed(2),
                descriptions: 'Salario de ' + moment(payStub?.payroll?.date).format('MMMM [de] YYYY'),
                address: 'Luanda Angola',
                swift: account?.swift,
                localCurrency: payStub?.localCurrency
            }

        })

        const fnKey: any = { psx: PayRollExtract.psx, ps2: PayRollExtract.ps2, xls: PayRollExtract.xls, xlsx: PayRollExtract.xlsx }

        const [data, contentType]: any = fnKey[`${type}`](payStubData, payroll, { bankAccount, company, payStubs });



        const blob = new Blob([data], { type: contentType },);
        const fileName = [name, type?.toUpperCase()].join('.')

        return { blob, fileName, contentType };
    }

    static psx = (data: PayStubDataType[], payroll: Payroll, { bankAccount, company }: { bankAccount: AccountPaymentData, company: Company }) => {
        const generateHeader = (payroll: any) => {
            return [
                //[CONSTANT]    
                "PSX10800000",
                //[IBAN DE ORIGEM]
                bankAccount?.iban?.substring(4),
                //[MOEDA]
                bankAccount?.currency,
                //[DATA]
                String(payroll?.year) + String(payroll?.month)?.padStart(2, '0') + '28',

                //[DESCRICAO]
                "Ordenandos".padEnd(39, '0')
            ].join('');
        }
        const generateLine = (params: any) => {

            const { fullName, iban, value, descriptions, address, swift } = params;
            const nib = iban?.substring(4)
            return [
                //[constante]
                'PSX208000'
                //[NIB]
                , nib,
                //[13digitos]
                String(value)?.replace('.', '')?.padStart(13, '0')
                //[20 caracteres]
                , fullName?.replace(/ /g, '.')?.padEnd(20, '.')
                //[15 caracteres]
                , descriptions?.replace(/ /g, '.')?.padEnd(15, '.')
                // [constante]
                , '001'
                //[40 digitos] 
                , fullName?.replace(/ /g, '.')?.padEnd(40, '.')
                // [80 digitos]
                , address?.padEnd(80, ' ')
                //[11 caracteres]     
                , swift?.padEnd(11, ' ')
                //[34 caracteres]
                , iban?.padEnd(34, ' ')
                //[constante]
                , 'SALASALA'
            ].join('')
            //[constante][NIB][13digitos][20 caracteres [constante][40 digitos]  [80 digitos][11 caracteres]     [34 caracteres][constante]
            //PSX208000  NIB  Montante   Nome completo  001        Nome completo Endereço    SWIFT BANCO DESTINO IBAN           SALASALA
        }

        const header = generateHeader(payroll);

        let lines = data.map(generateLine);

        return [[header, ...lines].join('\n'), 'text/plain'];
    }

    static xls = (data: PayStubDataType[], payroll: Payroll, { bankAccount, company }: { bankAccount: AccountPaymentData, company: Company }) => {
        const generateMainHeader = (payroll: any) => {
            return [
                ['', 'Cabeçalho', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'NIB Ordenante', bankAccount?.iban?.substring(4), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Moeda de Origem', bankAccount?.currency, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Data de Processamento: (dia-mês-ano)', moment().format('DD/MM/YYYY'), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Código de Operação', '11', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Referência do Ordenante:', 'Sal.Ref.' + moment(payroll?.date).format('MM/YYYY'), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

            ]
        }
        const generateHeader = (payroll: any) => {

            return [
                '',
                'Nome',
                'Referência da Transferência',
                'Referência da Empresa',
                'Morada do Beneficiário',
                'IBAN ou NIB',
                'VALOR',
                'Moeda',
                'Endereço',
                'SWIFT',
                'Tipo Despesas',
                'Codigo Estatistico',
                'Mensagem Destinatario',
                'Nome do Banco',
                'Morada do Banco',
                'Detalhe do Pagamento',

            ]
            return [
                //[CONSTANT]    
                "PSX10800000",
                //[IBAN DE ORIGEM]
                "5500004336236310103",
                //[MOEDA]
                "AKZ",
                //[DATA]
                String(payroll?.year) + String(payroll?.month).padStart(2, '0') + '28',

                //[DESCRICAO]
                "Ordenandos".padEnd(39, '0')
            ].join('');
        }
        const generateLine = (params: any, no: number) => {

            const { fullName, iban, value: v, descriptions, address, swift, localCurrency } = params;

            const value = Number(v * (localCurrency?.value ?? 1)).toFixed(2);

            const nib = iban?.substring(4)?.padEnd(21, '0');
            return {
                no: no + 1,
                fullName,
                descriptions,
                ii: company?.name?.toUpperCase(),
                address,
                nib,
                value, 
            }

        }


        const mainHeader: any = generateMainHeader(payroll);
        const header: any = generateHeader(payroll);

        let lines = data.map(generateLine);

        /* generate worksheet and workbook */
        const worksheet = XLSX.utils.json_to_sheet(lines);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

        /* fix headers */
        XLSX.utils.sheet_add_aoa(worksheet, [...mainHeader, header], { origin: "A1" });

        worksheet["!cols"] = [{ wch: 4 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        var wopts: any = { bookType: "xlsx", bookSST: false, type: "array" };

        const wdata: any = XLSX.write(workbook, wopts);


        return [wdata, "application/octet-stream"]
    }

    static xlsx = (data: PayStubDataType[], payroll: Payroll, { bankAccount, company, payStubs }: { bankAccount: AccountPaymentData, company: Company, payStubs: PayStub[] }) => {
        const generateMainHeader = (payroll: any) => {
            return [
                ['', company?.name, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'NIF', company?.nif, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'NIB Ordenante', bankAccount?.iban?.substring(4), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Data de Processamento: ', moment().format('DD/MM/YYYY'), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', 'Folha de Remuneração de ' + moment(payroll?.date).format('MMMM [de] YYYY'), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

            ]
        }

        const border = {
            top: { border: { top: { style: 'medium' } } },
            bottom: { border: { bottom: { style: 'medium' } } },
            left: { border: { left: { style: 'medium' } } },
            right: { border: { right: { style: 'medium' } } },
            all: {
                border: {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },

                }
            }
        };

        const generateHeader = (payroll: any) => {
            const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } }, alignment: { vertical: 'center', horizontal: 'center' } };
            return [
                [
                    { v: '', t: "s", s: { ...headerStyle, border: { ...border.all.border, ...border.top.border } } },
                    { v: 'Mecanografico', t: "s", s: { ...headerStyle, border: { ...border.all.border, ...border.top.border } } },
                    { v: 'Nome', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Função', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Categoria', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'IBAN', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Vencimento Base', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Subsidios', t: "s", s: { ...headerStyle, border: { ...border.all.border, ...border.top.border } } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Total Bruto', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Deduções', t: "s", s: { ...headerStyle, border: { ...border.all.border, ...border.top.border } } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: '', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Total Deduções', t: "s", s: { ...headerStyle, ...border.top } },
                    { v: 'Liquido', t: "s", s: { ...headerStyle, ...border.top } },

                ],

                [
                    { v: '', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Mecanografico', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Nome', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Função', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Categoria', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'IBAN', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Vencimento Base', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Férias', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Natal', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Transporte', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Alimentação', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Outros', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Total Bruto', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'IRT', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'INSS', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Outras', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Total Deduções', t: "s", s: { ...headerStyle, ...border.bottom } },
                    { v: 'Liquido', t: "s", s: { ...headerStyle, ...border.bottom } },

                ]
            ]
        }
        const generateLine = (payStub: PayStub, no: number) => {

            //const { fullName, iban, value, descriptions, address, swift } = payStub;
            //const nib = iban.substring(4).padEnd(21, '0');
            return [
                //''
                no + 1,
                //Mecanografico
                payStub?.contract?.employee?.code,
                //Nome
                payStub?.contract?.employee?.person?.fullName,

                //Função
                payStub?.contract?.role?.name,
                //categoria
                '',
                //NIB
                payStub?.contract?.employee?.accounts.find(() => true)?.iban,
                //Vencimento Base
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.Base)?.value ?? 0,

                //Subsidio de Férias
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.vocationSupport)?.value ?? 0,

                //Subsidio de Natal
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.ChristmansSupport)?.value ?? 0,

                //Subsidio de Transporte
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.TransportSupport)?.value ?? 0,

                //Subsidio de Alimentação
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.FoodSupport)?.value ?? 0,

                //Outros Subsidios
                payStub?.lines?.filter((line: PayrollLine) => line?.debit && ![
                    PayStubLineTypeConst.Base,
                    PayStubLineTypeConst.vocationSupport,
                    PayStubLineTypeConst.ChristmansSupport,
                    PayStubLineTypeConst.TransportSupport,
                    PayStubLineTypeConst.FoodSupport
                ].includes(line?.code))?.map(({ value }: any) => value)?.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0) ?? 0,

                //Total Bruto
                payStub?.grossValue ?? 0,

                //IRT
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.WiTax)?.value ?? 0,

                //INSS
                payStub?.lines?.find((line: PayrollLine) => line?.code === PayStubLineTypeConst.SSValue)?.value ?? 0,

                //Outras Deduções
                payStub?.lines?.filter((line: PayrollLine) => !line?.debit && ![
                    PayStubLineTypeConst.WiTax,
                    PayStubLineTypeConst.SSValue,
                ].includes(line?.code))?.map(({ value }: any) => value)?.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0) ?? 0,

                //Total Deduções
                payStub?.deductionValue ?? 0,

                //Liquido
                payStub?.netValue ?? 0
            ]

        }


        const mainHeader: any = generateMainHeader(payroll);
        const header: any = generateHeader(payroll);

        let lines = payStubs.map(generateLine);

        const worksheet =
            XLSX2.utils.json_to_sheet([...mainHeader, ...header, ...lines]);

        const workbook = XLSX2.utils.book_new();
        const alphabet = 'abcdefghijklmnopqr'.split('');

        alphabet.forEach((a: string) => {
            let i = 11;
            let stop = i + lines.length;

            do {

                worksheet[a?.toUpperCase() + String(i++)].s = {
                    font: { sz: 8 },
                    border: {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },

                    },
                };


            } while (i < stop)
        });


        alphabet.forEach((a: string) => {
            let i = 9;
            let stop = i + 2;

            do {

                let styles = worksheet[a?.toUpperCase() + String(i++)].s;
                worksheet[a?.toUpperCase() + String(i++)].s = {
                    font: { sz: 10 },
                    ...styles,
                    border: {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                        //...styles?.border
                    },
                };


            } while (i < stop)
        });

        worksheet["B7"].s = {
            font: {
                name: "Calibri",
                sz: 16,
                bold: true,
            },
        };
        worksheet["B2"].s = {
            font: {
                name: "Calibri",
                sz: 18,
                bold: true,
            },
        };

        worksheet["A1"] = '';
        const merge = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } },
            { s: { r: 1, c: 1 }, e: { r: 1, c: 6 } },
            { s: { r: 6, c: 1 }, e: { r: 6, c: 6 } },
            { s: { r: 8, c: 0 }, e: { r: 9, c: 0 } },
            { s: { r: 8, c: 1 }, e: { r: 9, c: 1 } },
            { s: { r: 8, c: 2 }, e: { r: 9, c: 2 } },
            { s: { r: 8, c: 3 }, e: { r: 9, c: 3 } },
            { s: { r: 8, c: 4 }, e: { r: 9, c: 4 } },
            { s: { r: 8, c: 5 }, e: { r: 9, c: 5 } },
            { s: { r: 8, c: 6 }, e: { r: 9, c: 6 } },
            { s: { r: 8, c: 7 }, e: { r: 8, c: 11 } },
            { s: { r: 8, c: 12 }, e: { r: 9, c: 12 } },
            { s: { r: 8, c: 13 }, e: { r: 8, c: 15 } },
            { s: { r: 8, c: 16 }, e: { r: 9, c: 16 } },
            { s: { r: 8, c: 17 }, e: { r: 9, c: 17 } },
        ];
        worksheet["!merges"] = merge;
        XLSX2.utils.book_append_sheet(workbook, worksheet, "nova.ao");

        worksheet["!cols"] = [{ wch: 4 }, { wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        var wopts: any = { bookType: "xlsx", bookSST: false, type: "array" };

        const wdata: any = XLSX2.write(workbook, wopts);

        const fileName = UUID() + '.xlsx';
        XLSX.writeFile(workbook, "tmp/" + fileName, wopts);

        return [wdata, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    }

    static ps2 = (data: PayStubDataType[], payroll: Payroll, { bankAccount, company }: { bankAccount: AccountPaymentData, company: Company }) => {

        const generateHeader = (payroll: any) => {
            return [
                //[CONSTANT]    
                "PS2108000",
                //[IBAN DE ORIGEM]
                bankAccount?.iban?.substring(4),
                //[MOEDA]
                bankAccount?.currency,
                //[DATA]
                String(payroll?.year) + String(payroll?.month)?.padStart(2, '0') + '28',

                //[DESCRICAO]
                "PGT".padEnd(4, ' '),

                ('SALARIOS DE ' + moment(payroll?.date).format('MMMM')?.toUpperCase())?.padEnd(35, ' '),
            ].join('');
        }

        const generateLine = (params: any) => {

            const { fullName, iban, value, descriptions, address, swift } = params;
            const nib = iban?.substring(4)
            return [
                //[constante]
                'PS2208000'
                //[NIB]
                , nib?.padStart(21, '0'),
                //[13digitos]
                String(value)?.replace('.', '')?.padStart(13, '0')
                //[15 caracteres]
                , company?.name?.toUpperCase()?.replace(',', ' ')?.padEnd(20, ' ')
                //[20 caracteres]
                , fullName?.toUpperCase()?.replace(/ /g, ' ')?.padEnd(15, ' ')

            ].join('')
            //[constante][NIB][13digitos][20 caracteres [constante][40 digitos]  [80 digitos][11 caracteres]     [34 caracteres][constante]
            //PSX208000  NIB  Montante   Nome completo  001        Nome completo Endereço    SWIFT BANCO DESTINO IBAN           SALASALA
        }

        const header = generateHeader(payroll);

        let lines = data.map(generateLine);

        return [[header, ...lines].join('\n'), 'text/plain'];
    }
}

export default PayRollExtract;