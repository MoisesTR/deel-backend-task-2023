import { injectable } from "inversify";
import { Op } from "sequelize";
import { Contract, Job } from "src/model";
import { ContractStatusEnum } from "src/types/enums/contract";

@injectable()
export class JobService {
  constructor() {}

  async findAllUnpaidJobsByProfile(profileId: number) {
    return await Job.findAll({
      where: {
        paid: false,
      },
      include: {
        model: Contract,
        where: {
          status: ContractStatusEnum.IN_PROGRESS,
          [Op.or]: {
            ContractorId: profileId,
            ClientId: profileId,
          },
        },
        required: true,
      },
    });
  }
}
