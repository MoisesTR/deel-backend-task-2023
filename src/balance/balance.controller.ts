import { NextFunction, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  interfaces,
  next,
  request,
  response,
} from "inversify-express-utils";
import { getProfile } from "src/middleware/getProfile";
import { TYPES } from "src/types/inversify.types";
import { ProfileRequest } from "src/types/request";
import { BalanceService } from "./balance.service";
import { AppError } from "src/utils/app.error";

@controller("/balances")
export class BalanceController implements interfaces.Controller {
  constructor(
    @inject(TYPES.BalanceService)
    private readonly balanceService: BalanceService
  ) {}

  @httpPost("/deposit/:userId", getProfile)
  async deposit(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { userId } = req.params;
    const { depositAmount } = req.body;
    const { profile } = req;

    if (parseInt(userId) !== profile.id) {
      throw new AppError(
        "Deposit Denied: You are only allowed to deposit into your own account.",
        401
      );
    }

    await this.balanceService.deposit(profile.id, Number(depositAmount));
    return res.status(200).end();
  }
}
