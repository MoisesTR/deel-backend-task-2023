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
import { TYPES } from "src/types/inversify.types";
import { ProfileRequest } from "src/types/request";
import { AdminService } from "./admin.service";

@controller("/admin")
export class AdminController implements interfaces.Controller {
  constructor(
    @inject(TYPES.AdminService)
    private readonly adminService: AdminService
  ) {}

  @httpGet("/best-profession")
  async findBestProfession(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { start, end } = req.query;
    const startDate = String(start);
    const endDate = String(end);
    const validationResult = this.validateDates(startDate, endDate);

    if (!validationResult.valid) {
      return res.status(400).send(validationResult.message);
    }

    const bestProfession = await this.adminService.findBestProfession(
      new Date(startDate),
      new Date(endDate)
    );

    if (!bestProfession) {
      return res.status(404).send("Best profession not found");
    }

    return res.json(bestProfession);
  }

  private validateDates(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      return {
        valid: false,
        message: "Both start date and end date are required.",
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, message: "Invalid date format." };
    }

    if (start > end) {
      return { valid: false, message: "Start date must be before end date." };
    }

    return { valid: true };
  }
}
