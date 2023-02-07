import sequelize , { User } from "../../models/index";

const repository = sequelize?.getRepository(User);

export default  class UserRepository {
    
    
    public static find= async (id:string) => await User.findByPk(id);
    public static findBy= async (filter:any) => await User.findOne({where:filter});
    public static findAll= async () => await User.findAll();
    public static create = async (data:any) => await User.create(data);
    // public static update = async (user:User) => await repository.update(user);
    
}

