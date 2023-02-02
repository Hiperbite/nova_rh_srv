import { Table, Column, DataType, BeforeCreate, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Model , User} from "../index";

@Table({
  timestamps: true,
  tableName: "Sessions",
})
export default class Session extends Model {

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  valid?: boolean;

  @ForeignKey(() => User)
  userId?: string;
  @BelongsTo(() => User)
  user?: User;

  @BeforeCreate
  static createSession = async (token: Session) => {
   // token.token=authRepo.generateAccessSession(token.user?.email??"")
  }
}