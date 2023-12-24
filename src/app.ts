import "reflect-metadata";
import Express from "express";
import bodyParser from "body-parser";

import { container } from "./config/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";
import "./contract/contract.controller";
import "./job/job.controller";

let app: Express.Application = Express();
app.use(bodyParser.json());

/**
 * Attaches all registered controllers and middleware to the express application.
 * Returns the application instance.
 * */
app = new InversifyExpressServer(container, null, null, app).build();

export default app;
