import { injectable } from "inversify";
import { Transaction } from "sequelize";
import { Profile } from "src/model";

@injectable()
export class ProfileJobService {
  async incrementProfileBalance(profileId: number, balance: number, transaction: Transaction) {
    return Profile.increment(
      {
        balance,
      },
      {
        where: { id: profileId },
        transaction
      }
    );
  }

  async decrementProfileBalance(profileId: number, balance: number, transaction: Transaction) {
    return Profile.decrement(
      {
        balance,
      },
      {
        where: { id: profileId },
        transaction
      }
    );
  }
}
