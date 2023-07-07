import { Transaction } from "sequelize";
import {
  Model as M,
  ModelCtor,
  Repository as Repo,
} from "sequelize-typescript";
import sequelize from "../models/index";
import IRepository from "./iRepository";
import R from "./repository";

export default class Repository<T extends M> extends R<T> {
  constructor(private M: ModelCtor<T>, protected t?: Transaction) {
    super(M, t)    
  }
}
