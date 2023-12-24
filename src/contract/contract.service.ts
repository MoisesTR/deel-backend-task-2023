import { injectable } from "inversify";
import { Contract } from "../model";

@injectable()
export class ContractService {
  async find(id: string) {
    return Contract.findOne({
      where: {
        id,
      },
    });
  }
}
