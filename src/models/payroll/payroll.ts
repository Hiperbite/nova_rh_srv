import { includes } from "lodash";
import moment from "moment";
import { Op } from "sequelize";
import {
    Table,
    Column,
    DataType,
    Scopes,
    HasMany,
    AfterFind,
    AfterUpdate,
    AfterSave,
    AfterBulkUpdate,
    BeforeSave,
    BeforeUpdate,
    DefaultScope,
    BeforeCreate,
} from "sequelize-typescript";
import { Contract, Model, PayrollLine, PayrollStatus, PayStub, SalaryPackage } from "../index";
/**
 * 0 - Aberto
 * 1 - Analise * 
 * 2 - Confirmação
 * 3 - Aprovação
 * 4 - Execução
 */
export enum payrollState {
    Opened,
    Validated,
    Confirmed,
    Approved,
    Executed,
    //Stuck=90,
}



const stateButton = [
    { id: 0, icon: '', text: "Aberto", actions: ['Iniciar'], color: "secondary" },
    { id: 1, icon: '', text: "Analise", actions: ['Confirmar'], color: "info" },
    { id: 2, icon: '', text: "Confirmação", actions: ['Confirmar'], color: "primary" },
    { id: 3, icon: '', text: "Aprovado", actions: ['Executar'], color: "warning" },
    { id: 4, icon: 'check', text: "Exacutado", color: "success" },
    { id: 90, icon: '', text: "Pendente", actions: [], color: "secondary" },
]

@Scopes(() => ({
    default: {
        include: [{ model: PayStub, include: [PayrollLine, { model: Contract, include: [SalaryPackage] }] }]
    },
    simple: {
        include: [PayStub]
    }
}))

@DefaultScope(() => ({
    //   include: [PayStub]
}))
@Table({
    indexes: [
        { fields: ['year', 'month'], unique: true }
    ],
    timestamps: true,
    tableName: "Payrolls",
})
export default class Payroll extends Model {
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    month?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    year?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    state?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @HasMany(() => PayStub)
    payStubs!: PayStub[]

    @Column({
        type: DataType.VIRTUAL
    })
    initialPayStubs!: any[]


    @Column({
        type: DataType.VIRTUAL
    })
    get status() {
        return stateButton[this.state ?? 0]
    }

    @Column({
        type: DataType.VIRTUAL
    })
    get grossValue() {
        return this.payStubs?.map(({ grossValue }: any) => grossValue)?.reduce((x: number, y: number) => x + y, 0)
    }

    @Column({
        type: DataType.VIRTUAL
    })
    get deductionValue() {
        return this.payStubs?.map(({ deductionValue }: any) => deductionValue)?.reduce((x: number, y: number) => x + y, 0)
    }

    @Column({
        type: DataType.VIRTUAL
    })
    get netValue() {
        return this.payStubs?.map(({ netValue }: any) => netValue)?.reduce((x: number, y: number) => x + y, 0)
    }


    @BeforeCreate
    static initializePayroll = (payroll: Payroll) => {
        payroll.state = payrollState.Opened
    }

    @BeforeUpdate
    @BeforeSave
    static afterPayloadSave = async (payroll: Payroll) => {


        if (payroll.state === payrollState.Confirmed
        ) {


        } else
            if (
                payroll.state === payrollState.Approved ||
                payroll.state === payrollState.Executed
            ) {
                payroll?.payStubs?.
                    filter(({ state }: any) => state !== payrollState.Executed)?.
                    forEach((payStub: PayStub) => {
                        payStub.state = payroll.state
                        payStub.save();
                    })
            }

        if (payroll.state === payrollState.Executed) {
            const [year, month] = moment(payroll?.date).add(1, 'M').format('YYYY-MM').split('-');
            const nextPayroll = await Payroll.
                findOne({ where: { year, month } })

            if (nextPayroll) {
                nextPayroll.state = payrollState.Validated
                nextPayroll.save();
            }
        }
        return payroll;
    }

    @BeforeCreate
    static validateEligibility = async (payroll: Payroll) => {

        const now: any = payroll?.year + '-' + payroll?.month + '-01';

        const lastPayrollDate = moment(now).add(-1, 'M').toDate()
        const year = lastPayrollDate.getFullYear()
        const month = lastPayrollDate.getMonth() + 1
        const existPayroll: any = await Payroll.findOne({ where: { year, month } })
        if (existPayroll === null || existPayroll?.state < payrollState.Approved) {

            if (existPayroll === null) {
                const { count } = await Payroll.findAndCountAll()
                if (count > 0)
                    throw { message: 'Existe folhas anterior em andamento', code: 400 }
            }
            if (existPayroll?.state < payrollState.Approved)
                throw { message: 'Existe folhas anterior em andamento', code: 400 }
        }
    }

    @AfterFind
    static proposalStubs = async (payroll: Payroll) => {
        const payStubs: PayStub[] = [];
        if (payroll?.year === undefined) return;
        if ((payroll.state ?? 0) > payrollState.Confirmed) {
            /*
                        const { month, year } = payroll;
                        const existPayStub = await PayStub.findAll({ where: { month, year } });
                        if (existPayStub)
                            for (let p of existPayStub)
                                payroll.payStubs.push(p);
              */
            return payroll;
        }

        payroll.initialPayStubs = [];

        const proposalStubs = (await Contract.findAll({
            where: {
                isActive: true,
                startDate: { [Op.or]: { [Op.eq]: null, [Op.lt]: payroll?.year + '-' + payroll?.month + '-31' } },
                endDate: { [Op.or]: { [Op.eq]: null, [Op.gt]: payroll?.year + '-' + payroll?.month + '-01' } }
            },
            order: [['endDate', 'ASC']]
        }))?.map((contract: any) => ({
            date: payroll.date,
            month: payroll.month,
            year: payroll?.year,
            state: 0,
            descriptions: '',
            contract,
        }))

        if (payroll?.state === payrollState.Approved) {
        }
        else if (payroll?.state === payrollState.Confirmed) {

            for (let stub of proposalStubs) {
                const a: any = stub;
                //payStubs.push(a);
                let payStub = new PayStub();

                if (payroll?.payStubs?.find(({ contractId }: any) => contractId === stub?.contract?.id) === undefined) {
                    try {
                        const { month, year } = payroll;
                        const existPayStub = await PayStub.findOne({ where: { month, year, contractId: stub?.contract?.id } , include: { all: true } });
                        if (existPayStub) {
                            existPayStub.payrollId = String(payroll?.id)
                            existPayStub.save()
                            payStubs.push(existPayStub);
                        }
                        else {
                            payStub = await PayStub.create({
                                date: payroll.date,
                                month: payroll.month,
                                year: payroll?.year,
                                state: 0,
                                descriptions: '',
                                contractId: stub?.contract?.id,
                                payrollId: payroll?.id,
                                lines: stub?.contract.payStubState.lines

                            },  { include: { all: true } })
                            payStub.contract = stub?.contract;
                            payStub.lines = stub?.contract.payStubState.lines
                            payStubs.push(payStub);
                        }
                    }
                    catch (e: any) {
                        if (e?.existPayStub)
                            payStubs.push(e?.existPayStub);
                    }
                }
            }
        }
        else {
            for (let stub of proposalStubs) {
                payroll?.initialPayStubs?.push(stub);

                const a: any = stub;
                //  payStubs.push(a);
                let payStub = new PayStub();
                if (payroll?.payStubs?.find(({ contractId }: any) => contractId === stub?.contract?.id) === undefined) {

                    try {
                        const { month, year } = payroll;
                        const existPayStub = await PayStub.findOne({ where: { month, year, contractId: stub?.contract?.id } });
                        if (existPayStub) {
                            existPayStub.payrollId = String(payroll?.id)
                            existPayStub.save()
                            payStubs.push(existPayStub);
                        }
                        else {
                            const lines = stub?.contract.payStubState.lines//.filter(({ startDate }: any) => startDate === undefined || startDate && moment(startDate).isSameOrBefore(new Date(payroll?.year ?? 0, (payroll?.month ?? 0) - 1, 1)))
                            payStub = new PayStub({
                                date: payroll.date,
                                month: payroll.month,
                                year: payroll?.year,
                                state: 0,
                                descriptions: '',
                                contractId: stub?.contract?.id,
                                contract: stub?.contract,
                                payrollId: payroll?.id,
                                lines

                            }, { include: { all: true } })
                            payStub.contract = stub?.contract;
                            //    payStub.lines = stub?.contract.payStubState.lines
                            payStubs.push(payStub);
                        }
                    }
                    catch (e: any) {
                        if (e?.existPayStub)


                            payStubs.push(e?.existPayStub);
                    }
                }
            }

        }
        for (let p of payStubs) {
            if (payroll.payStubs === undefined)
                payroll.payStubs = []
            payroll.payStubs.push(p);
        }

        return payroll;
    }

}