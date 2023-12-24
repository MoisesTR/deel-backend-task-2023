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

  async findBestClients(start: Date, end: Date, limit: number) {
    return Job.findAll({
      attributes: [
        "Contract.Client.id",
        [sequelize.fn("sum", sequelize.col("price")), "paid"],
        [
          sequelize.literal(
            "'Contract->Client'.firstName || ' ' || 'Contract->Client'.lastName"
          ),
          "fullName",
        ],
      ],
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      group: ["Contract.Client.id"],
      order: [[sequelize.literal("paid"), "DESC"]],
      limit: limit,
      raw: true,
    });
  }
}
