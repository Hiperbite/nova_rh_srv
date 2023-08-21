
import { Model } from "./../index";
import {
    Table, Scopes, Column, DataType
} from "sequelize-typescript"

@Scopes(() => ({
    default: {
        include: []
    }
}))

@Table({
    tableName: "EmployeeAusence",
    timestamps: true
})

export default class Ausence extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name!: string
    
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    code?: string
}