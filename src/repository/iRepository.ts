import { Paginate } from "./repository";

export default interface IRepository<T> {
  one(id: string, query?: any): Promise<T | null>;
  oneBy(query: any): Promise<T | null>;
  create(data: any,opts?:any): Promise<T | undefined>;
  update(data: any, opts?:any): Promise<T | undefined>;
  delete(data: any): Promise<any>;

  first(): Promise<T | null>;
  last(): Promise<T | null>;
  disable(data: any): Promise<T | undefined>;
  enable(data: any): Promise<T | undefined>;
  //clear(): Promise<boolean>;
  all(opts?: any): Promise<Array<T> | undefined>;
  paginated:(opts?: any)=>Promise<Paginate<T> | undefined> ;
}