import { NextFunction, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  next,
  request,
  response,
} from "inversify-express-utils";
import { getProfile } from "src/middleware/getProfile";
import { TYPES } from "src/types/inversify.types";
import { ProfileRequest } from "src/types/request";
import { JobService } from "./services/job.service";

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

  @httpPost("/:job_id/pay", getProfile)
  async payJob(
    @request() req: ProfileRequest,
    @response() res: Response,
    @next() _next: NextFunction
  ) {
    const { job_id } = req.params;

    await this.jobService.payJob(req.profile, parseInt(job_id));
    return res.status(200).end();
  }
}
