import { Container } from "inversify";
import { AdminService } from "src/admin/admin.service";
import { ContractService } from "src/contract/contract.service";
import { JobService } from "src/job/services/job.service";
import { ProfileJobService } from "src/job/services/profile-job.service";
import { TYPES } from "src/types/inversify.types";

const container = new Container();
container.bind(TYPES.ContractService).to(ContractService);
container.bind(TYPES.JobService).to(JobService);
container.bind(TYPES.AdminService).to(AdminService);
container.bind(TYPES.ProfileJobService).to(ProfileJobService);

export { container };
