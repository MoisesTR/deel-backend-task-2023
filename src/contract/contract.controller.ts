import { NextFunction, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  interfaces,
  next,
  request,
  response,
} from "inversify-express-utils";
import { getProfile } from "src/middleware/getProfile";
import { TYPES } from "src/types/inversify.types";
import { ContractService } from "./contract.service";
import { ProfileRequest } from "src/types/request";

@controller("/contracts")
export class ContractController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ContractService)
    private readonly contractService: ContractService
  ) {}

  @httpGet("/:id", getProfile)
  async find(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { id } = req.params;
    const { profile } = req;

    const contract = await this.contractService.find(id);
    if (!contract) return res.status(404);

    if (
      contract.ContractorId !== profile.id &&
      contract.ClientId !== profile.id
    ) {
      return res.status(403).end();
    }

    return res.json(contract);
  }
}
