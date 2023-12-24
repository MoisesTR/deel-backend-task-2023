import "reflect-metadata";
import Express from "express";
import bodyParser from "body-parser";

import { container } from "./config/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";
import { errorMiddleware } from "./middleware/global-handle-error";

import "./contract/contract.controller";
import "./job/job.controller";
import "./admin/admin.controller";
import "./balance/balance.controller";

let app: Express.Application = Express();
app.use(bodyParser.json());

/**
 * Attaches all registered controllers and middleware to the express application.
 * Returns the application instance.
 * */
app = new InversifyExpressServer(container, null, null, app).build();

app.use(errorMiddleware);

export default app;
