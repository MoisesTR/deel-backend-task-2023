import 'reflect-metadata'
import Express from "express";
import bodyParser from "body-parser";

import { sequelize } from "./model";
import { getProfile } from "./middleware/getProfile";
import { container } from "./config/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";

let app: Express.Application = Express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * Attaches all registered controllers and middleware to the express application.
 * Returns the application instance.
 * */
app = new InversifyExpressServer(container, null, null, app).build();

/**
 * FIX ME!
 * @returns contract by id
 */
app.get("/contracts/:id", getProfile, async (req, res) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) return res.status(404).end();
  return res.json(contract);
});

export default app;
