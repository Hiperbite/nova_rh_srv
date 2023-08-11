
import {Column, DataType,Table,Scopes, HasOne} from "sequelize-typescript"
import {Company, Model} from "./../index"

@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "Business"
})
export default class Business extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;
}