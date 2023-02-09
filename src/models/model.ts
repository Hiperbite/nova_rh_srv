import {
    Table,
    Model as Main,
    Column,
    DataType,
    HasMany,
    BeforeCreate,
    BeforeUpdate,
  } from "sequelize-typescript";
  import { uuid } from "uuidv4";
  
  export default class Model extends Main {
   
    @Column({
      type: DataType.BOOLEAN,
    })
    isActive!: boolean;
  
    @BeforeCreate
    static prepare = (model: Model) => {
      model.id = uuid();
      model.isActive = false;
    };
  
    @BeforeUpdate
    static prepareUpdate = (model: Model) => {
      model.id ||= uuid();
      model.isActive ||= true;
    };
  }