import { Request, Response } from "express";
import { Address, Person } from "../../models/index";

import { Paginate } from "../../repository/repository";

import Api from "../Api";

class AddressApi extends Api<Address> {
  constructor() { super(Address)};

  create = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    const { livingAddress, birthPlaceAddress, personId } = body
    const address: Address | void = await this.repo.create(body, { include: { all: true } });

    return res.json(address);
  };
  update = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { body } = req;
    let { livingAddress, birthPlaceAddress, personId, updatedById } = body
    let person: any = {}

    let updatedAddress: any[] = []
    if (personId) {
      person = await Person.findByPk(personId)
    }
    if (livingAddress) {
      if (livingAddress.id) {
        await this.repo.update({ ...livingAddress, updatedById }, { where: { id: livingAddress.id }, returning: true });
        livingAddress=await Address.findByPk(livingAddress?.id)
      } else {
        livingAddress = await this.repo.create({ ...livingAddress, updatedById });
      }
      person.livingAddress = livingAddress;
      person.livingAddressId = livingAddress?.id;
      updatedAddress.push(livingAddress)
    }

    if (birthPlaceAddress) {
      if (birthPlaceAddress.id) {
        await this.repo.update({ ...birthPlaceAddress, updatedById }, { where: { id: birthPlaceAddress.id }, returning: true });
        birthPlaceAddress=await Address.findByPk(birthPlaceAddress?.id)
      } else {
        birthPlaceAddress = await this.repo.create({ ...birthPlaceAddress, updatedById });
      }
      person.birthPlaceAddress = birthPlaceAddress;
      person.birthPlaceAddressId = birthPlaceAddress?.id;
      updatedAddress.push(birthPlaceAddress)
    }
    try {
     const y= await person.save();  
    } catch (error) {
      let err=error
    }

    

    return res.json(updatedAddress);




  };
  find = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { query: opts } = req;


    const address: Address | undefined = await this.repo.one(
      id,
      { ...opts, include: { all: true } }
    );
    return res.json(address);
  };
  findBy = async (req: Request, res: Response): Promise<Response> => {
    const addresss: Paginate<Address> | undefined =
      await this.repo.paginated({ ...req.query, include: { all: true } });
    return res.json(addresss);
  };
}

export default new AddressApi();
export { AddressApi };
