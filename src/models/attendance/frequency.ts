import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    Scopes,
} from "sequelize-typescript";

import {
    Model,
    Contract,
    Employee,
    Person,
    Department,
} from "../index";

const states = [
    { id: 0, name: "Entrada" },
    { id: 1, name: "Saída" }
]

@Scopes(() => ({
    full: { include: [{ model: Contract, include: [Department,{ model: Employee, include: [Person] }] }] }
}))
@Table({
    indexes: [
        //{ fields: ['state', 'date', 'contractId'], unique: true }
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
        type: DataType.INTEGER,
    })
    type?: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date;
    
    @BelongsTo(() => Contract)
    contract!: Contract;

    @ForeignKey(() => Contract)
    contractId!: string;
}

