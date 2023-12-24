import { Container } from "inversify";
import { ContractService } from "src/contract/contract.service";
import { TYPES } from "src/types/inversify.types";

const container = new Container();
container.bind(TYPES.ContractService).to(ContractService);

export { container };
