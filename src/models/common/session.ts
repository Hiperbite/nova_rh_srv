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
  static createSession = async (session: Session) => {
    session.valid = true;
   // token.token=authRepo.generateAccessSession(token.user?.email??"")
  }
}