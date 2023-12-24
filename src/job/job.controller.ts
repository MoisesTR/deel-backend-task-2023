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
import { ProfileRequest } from "src/types/request";
import { JobService } from "./job.service";

@controller("/jobs")
export class JobController implements interfaces.Controller {
  constructor(
    @inject(TYPES.JobService)
    private readonly jobService: JobService
  ) {}

  @httpGet("/unpaid", getProfile)
  async findAllUnpaidJobsByProfile(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const unpaidJobs = await this.jobService.findAllUnpaidJobsByProfile(
      req.profile.id
    );
    return res.json(unpaidJobs);
  }
}
