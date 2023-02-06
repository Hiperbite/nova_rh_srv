import { connection as Sequelize, Employee } from "../../models/index";

const repository = Sequelize.getRepository(Employee);

export default class EmployeeRepository {

    public static findAll= async () => await repository.findAll();
    public static create= async (data:any) => await repository.create(data);
    public static update= async (employee:Employee, data:any) => await repository.update(data,{where:{id:employee.id}});
    public static createOce = async () => await 
        repository.create({
            firstName: 'Sebastiao',
            lastName: 'Lutonda',
            otherNames: 'Dias',
            descriptions: 'none',
            birthDate: '2000-12-23',
            nationality: 'AO',
            idcard: '326598875421',
            passPortNumber: 'N0002150012',
            province: 'Luanda'
        });
    
}