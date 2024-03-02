import SequenceApp from "../../application/common/sequence.app";

import moment from "moment";
import { Op } from "sequelize";
import {
    Table,
    Column,
    DataType,
    Scopes,
    HasMany,
    BeforeSave,
    BeforeUpdate,
    DefaultScope,
    BeforeCreate,
    BelongsTo,
    ForeignKey,
    AfterCreate,
} from "sequelize-typescript";
import { Company, Contract, Department, Employee, Model, PayrollLine, PayrollStatus, PayStub, Person, EmployeeRole, SalaryPackage, PayrollSetting, Currency, } from "../index";
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
    //Confirmed,
    Approved,
    Executed,
    //Stuck=90,
}

const states = [
    { id: 0, text: "Aberto", actions: ['Confirmar'], color: "secondary" },
    { id: 1, text: "Analise", actions: ['Aprovar'], color: "info" },
    { id: 2, text: "Aprovado", actions: ['Executar'], color: "warning" },
    { id: 3, text: "Exacutado", color: "success", actions: [] },
]

@Scopes(() => ({
    default: {
        include: [{ model: PayStub, include: [PayrollLine, { model: Contract, include: [SalaryPackage, EmployeeRole, Department, { model: Employee, include: [Person] }] }] }]
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
        //{ fields: ['year', 'month','id'], unique: true }
    ],
    timestamps: true,
    tableName: "Payrolls",
})
export default class Payroll extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code?: string;

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
        defaultValue: 0,
    })
    type?: number;

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
        type: DataType.VIRTUAL,
    })
    get currentState() {

        return {
            state: states?.find(({ id }: any) => id === this.state ?? 0),
            states
        }
    }

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @HasMany(() => PayStub)
    payStubs!: PayStub[]

    @BelongsTo(() => Company)
    company?: Company

    @ForeignKey(() => Company)
    companyId?: string

    @Column({
        type: DataType.VIRTUAL
    })
    initialPayStubs!: any[]


    @Column({
        type: DataType.VIRTUAL
    })
    get status() {
        return states[this.state ?? 0]
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
    static initializePayroll = async (payroll: Payroll, { transaction }: any) => {
        payroll.month = payroll.date?.getMonth()
        payroll.year = payroll.date?.getFullYear()
        payroll.state = payrollState.Opened


        let code = await SequenceApp.count(PayStub.name, { transaction });
        payroll.code = String(code).padStart(8, '0');

    }

    @BeforeUpdate
    @BeforeSave
    static afterPayloadSave = async (payroll: Payroll) => {


        if (payroll.state === payrollState.Approved) {


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

        //if (Number(payroll?.type) === 1)
            return;

        const existPendingPayroll = await Payroll.findOne({
            where: {
                state: { [Op.lt]: payrollState.Approved }
            }
        })
        if (existPendingPayroll)
            throw { message: 'Existe folhas anterior em andamento', code: 400 }


    }

    @AfterCreate
    static proposalStubs = async (payroll: Payroll, { transaction }: any = { transaction: null }) => {

        if (Number(payroll?.type) === 1)
            return;

        payroll.initialPayStubs = [];
        const contractIds = payroll?.payStubs?.map(({ contractId }: any) => contractId)


        const { salaryProcessingCurrency }: any = await PayrollSetting.findOne({ where: {}, include: [Currency] })

        const endDate = moment().set('year', payroll?.year ?? 2000).set('month', (payroll?.month ?? 1) - 1).endOf('month').format('YYYY-MM-DD')
        const startDate = moment().set('year', payroll?.year ?? 2000).set('month', (payroll?.month ?? 1) - 1).startOf('month').format('YYYY-MM-DD')
        const elegibleContracts = (await Contract.findAll({
            where: {
                isActive: true,
                startDate: { [Op.or]: { [Op.eq]: null, [Op.lt]: endDate } },
                endDate: { [Op.or]: { [Op.eq]: null, [Op.gt]: startDate } }
            },
            order: [['endDate', 'ASC']]
        })).filter(({ contractId }: any) => !contractIds?.find((x: string) => x === contractId))

        let payStubs = [];
        for (let contract of elegibleContracts) {
            try {
                let payStub = await PayStub.create
                    ({
                        date: payroll.date,
                        month: payroll.month,
                        year: payroll?.year,
                        state: 0,
                        descriptions: '',
                        contractId: contract?.id,
                        payrollId: payroll?.id,

                        localCurrency: {
                            descriptions:
                                salaryProcessingCurrency?.descriptions,
                            name:
                                salaryProcessingCurrency?.name,
                            value:
                                salaryProcessingCurrency?.value,
                            code:
                                salaryProcessingCurrency?.code,
                        }
                    }, { transaction })
                payStubs.push(payStub);
            }
            catch (err: any) {
                let y = err
                throw y;
            }

        }
        payroll.payStubs = [...(payroll?.payStubs ?? []), ...payStubs];
        //  return payroll;
    }

}