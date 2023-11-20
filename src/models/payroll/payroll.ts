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
    BelongsTo,
    ForeignKey,
    AfterCreate,
} from "sequelize-typescript";
import { Company, Contract, Department, Employee, Model, PayrollLine, PayrollStatus, PayStub, Person, Role, SalaryPackage } from "../index";
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
        include: [{ model: PayStub, include: [PayrollLine, { model: Contract, include: [SalaryPackage, Role, Department, { model: Employee, include: [Person] }] }] }]
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

        const year = payroll?.date?.getFullYear()
        const month = (payroll?.date?.getMonth() ?? 1) - 1
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

    @AfterCreate
    static proposalStubs = async (payroll: Payroll, { transaction }: any = { transaction: null }) => {

        payroll.initialPayStubs = [];
        const contractIds = payroll?.payStubs?.map(({ contractId }: any) => contractId)
        const elegibleContracts = (await Contract.findAll({
            where: {
                isActive: true,
                startDate: { [Op.or]: { [Op.eq]: null, [Op.lt]: payroll?.year + '-' + payroll?.month + '-31' } },
                endDate: { [Op.or]: { [Op.eq]: null, [Op.gt]: payroll?.year + '-' + payroll?.month + '-01' } }
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
                        payrollId: payroll?.id
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