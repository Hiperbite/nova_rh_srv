import { sequelize , User } from "../../models/index";

const repository = sequelize?.getRepository(User);

export default  class UserRepository {
    private transaction = async () => await sequelize.transaction();
    
    public static find= async (id:string) => await repository.findByPk(id);
    public static findBy= async (filter:any) => await repository.findOne({where:filter});
    public static findAll= async () => await repository.findAll();
    public static create = async (data:any) => await repository.create(data);
    // public static update = async (user:User) => await repository.update(user);
    
}

