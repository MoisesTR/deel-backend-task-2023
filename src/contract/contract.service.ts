import { injectable } from "inversify";
import { Contract } from "../model";
import { Op } from "sequelize";
import { ContractStatusEnum } from "src/types/enums/contract";

@injectable()
export class ContractService {
  async find(id: string) {
    return Contract.findOne({
      where: {
        id,
      },
    });
  }

  async findAllByProfile(profileId: number) {
    return await Contract.findAll({
      where: {
        status: { [Op.ne]: ContractStatusEnum.TERMINATED },
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    });
  }
}
