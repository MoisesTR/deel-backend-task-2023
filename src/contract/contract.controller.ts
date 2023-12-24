import { NextFunction, Response, Request } from "express";
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

@controller("/contracts")
export class ContractController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ContractService)
    private readonly contractService: ContractService
  ) {}

  // * FIX ME!
  @httpGet("/:id", getProfile)
  async find(
    @request() req: Request,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { id } = req.params;
    const contract = await this.contractService.find(id);
    if (contract === null) return res.status(404);
    return res.json(contract);
  }
}
