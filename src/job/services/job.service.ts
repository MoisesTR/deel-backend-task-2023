import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { Contract, Job, Profile, sequelize } from "src/model";
import { ContractStatusEnum } from "src/types/enums/contract";
import { TYPES } from "src/types/inversify.types";
import { ProfileJobService } from "./profile-job.service";
import { AppError } from "src/utils/app.error";

@injectable()
export class JobService {
  constructor(
    @inject(TYPES.ProfileJobService)
    private readonly profileJobService: ProfileJobService
  ) {}

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

  async payJob(profile: Profile, jobId: number) {
    return sequelize.transaction(async (transaction) => {
      const job = await Job.findOne({
        where: { id: jobId },
        include: {
          model: Contract,
          required: true,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!job) {
        throw new AppError("Job with the given id was not found", 404);
      }

      this.validateJobPayment(job, profile);

      await this.profileJobService.decrementProfileBalance(
        job.Contract.ClientId,
        job.price,
        transaction
      );
      await this.profileJobService.incrementProfileBalance(
        job.Contract.ContractorId,
        job.price,
        transaction
      );

      job.paid = true;
      job.paymentDate = new Date();
      await job.save({ transaction });

      return job;
    });
  }

  private validateJobPayment(job: Job, profile: Profile) {
    if (job.Contract.ClientId !== profile.id) {
      throw new AppError(
        "Action permitted only for jobs linked to your client account."
      , 400);
    }

    if (job.paid) {
      throw new AppError("This job has already been paid.", 400);
    }

    if (profile.balance === undefined || profile.balance === null) {
      throw new AppError(
        "Client balance not set. Please ensure the client account has a defined balance."
      , 404);
    }

    if (profile.balance < job.price) {
      throw new AppError(
        "Insufficient funds. The client's balance is too low to cover the job cost."
      , 400);
    }

    return { valid: true };
  }
}
