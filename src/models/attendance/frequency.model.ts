import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";

import {
    Model,
    User,
    Contract,
    Employee
} from "../index";

const states = [
    { id: 0, name: "Entrada" },
    { id: 1, name: "Saída" }
]

@Table({
    indexes: [
        { fields: ['state', 'startDate', 'endDate', 'employeeId', 'contractId'], unique: true }
    ],
    timestamps: true,
    tableName: "Frequencies",
})
export default class Frequency extends Model {

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    state?: number;

    @Column({
        type: DataType.VIRTUAL,
    })
    get currentState() {
        return states?.find(({ id }: any) => id === this.state ?? 0)
    }

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    startDate?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    endDate!: string;

    @BelongsTo(() => Employee)
    employee!: Employee

    @ForeignKey(() => Employee)
    employeeId!: string;

    @BelongsTo(() => Contract)
    contract!: Contract;

    @ForeignKey(() => Contract)
    contractId!: string;
}

