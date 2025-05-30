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
import { AppError } from "src/utils/app.error";

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
    this.validateDates(startDate, endDate);

    const bestProfession = await this.adminService.findBestProfession(
      new Date(startDate),
      new Date(endDate)
    );

    if (!bestProfession) {
      return res.status(404).send("Best profession not found");
    }

    return res.json(bestProfession);
  }

  @httpGet("/best-clients")
  async findBestClients(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { start, end, limit } = req.query;
    const startDate = String(start);
    const endDate = String(end);
  
    this.validateDates(startDate, endDate);

    const limitNumber = limit ? parseInt(String(limit)) : 2;
    if (isNaN(limitNumber) || limitNumber < 1) {
      throw new AppError("Limit must be a positive integer.", 400);
    }

    const bestClients = await this.adminService.findBestClients(
      new Date(startDate),
      new Date(endDate),
      limitNumber
    );

    return res.json(bestClients);
  }

  private validateDates(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new AppError("Both start date and end date are required.", 400)
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError("Invalid date format", 400);
    }

    if (start > end) {
      throw new AppError("Start date must be before end date", 400);
    }

    return { valid: true };
  }
}
