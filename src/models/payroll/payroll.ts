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
} from "sequelize-typescript";
import { Contract, Model, PayrollLine, PayrollStatus, PayStub } from "../index";
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
}


@Scopes(() => ({
    default: {
        include: [PayStub]
    },
    simple: {
        include: [PayStub]
    }
}))

@DefaultScope(() => ({
    include: [PayStub]
}))
@Table({
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
    @AfterFind
    static proposalStubs = async (payroll: Payroll) => {
        if (payroll?.year === undefined) return;
        if ((payroll.state ?? 0) > payrollState.Confirmed) return;

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

        if (

            payroll.state !== payrollState.Approved &&
            payroll.state !== payrollState.Executed
        ) {
            proposalStubs?.forEach(async (stub: any) => {
                payroll?.initialPayStubs?.push(stub);

                let payStub = new PayStub();
                if (payroll?.payStubs?.find(({ contractId }: any) => contractId === stub?.contractId) === undefined) {

                    try {
                        payStub = await PayStub.create({
                            date: payroll.date,
                            month: payroll.month,
                            year: payroll?.year,
                            state: 0,
                            descriptions: '',
                            contractId: stub?.contract?.id,
                            payrollId: payroll?.id,
                            lines: stub?.contract.payStubState.lines

                        }, { include: { all: true } })
                        payStub.contract = stub?.contract;

                        payroll?.payStubs?.push(payStub);
                    }
                    catch (e: any) {
                        let u = e;
                    }
                }
            })

        }

        return payroll;
    }

}