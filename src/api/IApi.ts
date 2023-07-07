
interface IApi {
  create(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  find(req: Request, res: Response): Promise<Response>;
  findBy(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  findBy(req: Request, res: Response): Promise<Response>;
}

export { IApi};