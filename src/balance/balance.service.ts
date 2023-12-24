import { inject, injectable } from "inversify";
import { Transaction } from "sequelize";
import { JobService } from "src/job/services/job.service";
import { sequelize } from "src/model";
import { ProfileService } from "src/profile/profile.service";
import { TYPES } from "src/types/inversify.types";
import { AppError } from "src/utils/app.error";

@injectable()
export class BalanceService {
  constructor(
    @inject(TYPES.JobService) private jobService: JobService,
    @inject(TYPES.ProfileService) private profileService: ProfileService
  ) {}

  async deposit(clientId: number, depositAmount: number) {
    if (typeof depositAmount !== "number" || isNaN(depositAmount)) {
      throw new AppError(
        "Invalid deposit amount. Please enter a valid numeric amount.",
        400
      );
    }

    if (depositAmount < 0) {
      throw new AppError(
        "Invalid deposit amount. Amount cannot be negative.",
        400
      );
    }

    // Pre-transaction calculation
    const initialTotalUnpaidJobsPrice =
      await this.jobService.findTotalUnpaidJobsByClient(clientId);

    // Perform the deposit
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (transaction) => {
        const maxAllowedDeposit = initialTotalUnpaidJobsPrice * 0.25;
        if (depositAmount > maxAllowedDeposit) {
          throw new AppError(
            "Deposit amount exceeds the allowed limit of 25% of total unpaid jobs.",
            400
          );
        }

        // Increment the client's balance
        await this.profileService.incrementProfileBalance(
          clientId,
          depositAmount,
          transaction
        );
      }
    );

    // Post-transaction validation
    const currentTotalUnpaidJobsPrice =
      await this.jobService.findTotalUnpaidJobsByClient(clientId);
    if (depositAmount > currentTotalUnpaidJobsPrice * 0.25) {
      // Compensating transaction
      // Revert the deposit if the condition is violated
      await sequelize.transaction(async (transaction) => {
        await this.profileService.decrementProfileBalance(
          clientId,
          depositAmount,
          transaction
        );
      });
      throw new AppError(
        "Post-deposit validation failed. Deposit has been reverted.",
        400
      );
    }
  }
}
