import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "./routes/index.routes";
import errorMiddleware from "./middleware/errorMiddleware";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setRoutes();
    this.setErrorHandling();
  }

  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private setRoutes() {
    this.app.use("/api", routes);
  }

  private setErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
