import { injectable } from "inversify";
import { Op } from "sequelize";
import { Contract, Job, Profile, sequelize } from "src/model";

@injectable()
export class AdminService {
  constructor() {}

  async findBestProfession(start: Date, end: Date) {
    return await Job.findOne({
      attributes: [
        [sequelize.col("Contract.Contractor.profession"), "profession"],
        [sequelize.fn("SUM", sequelize.col("Job.price")), "totalEarnings"],
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [start, end] },
      },
      include: {
        attributes: [],
        model: Contract,
        required: true,
        include: [
          {
            attributes: [],
            model: Profile,
            as: "Contractor",
            required: true,
          },
        ],
      },
      group: ["Contract.Contractor.profession"],
      order: [[sequelize.col("totalEarnings"), "DESC"]],
    });
  }
}
