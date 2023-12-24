import { Container } from "inversify";
import { AdminService } from "src/admin/admin.service";
import { BalanceService } from "src/balance/balance.service";
import { ContractService } from "src/contract/contract.service";
import { JobService } from "src/job/services/job.service";
import { ProfileService } from "src/profile/profile.service";
import { TYPES } from "src/types/inversify.types";

const container = new Container();
container.bind(TYPES.ContractService).to(ContractService);
container.bind(TYPES.JobService).to(JobService);
container.bind(TYPES.AdminService).to(AdminService);
container.bind(TYPES.ProfileService).to(ProfileService);
container.bind(TYPES.BalanceService).to(BalanceService);

export { container };
