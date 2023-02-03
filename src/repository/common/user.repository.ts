import { connection as Sequelize, User } from "../../models/index";

const repository = Sequelize.getRepository(User);

export default class UserRepository {

    public static find= async (id:string) => await repository.findByPk(id);
    public static findAll= async () => await repository.findAll();
    public static create = async (data:any) => await repository.create(data);
    
}