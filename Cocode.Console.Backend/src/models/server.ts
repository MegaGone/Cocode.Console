import express, { Application } from "express";
import cors from "cors";
import Swagger from "swagger-ui-express";

import {
  Auth,
  User,
  Payment,
  Incident,
  Notification,
  Service,
} from "../routes";

import { PORT, SQL_MAX_SIZE_IMAGE, SQL_PARAMETER_LIMIT_IMAGE } from "../config";
import { openApiConfig } from "../documentation";
import { GenericDataSource } from "../database/connection";
import {
  UserService,
  AuthService,
  PaymentService,
  IncidentService,
  NotificationService,
  ServicesService,
} from "../services";
import { Path } from "../typings";
export class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = PORT;

    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private async dbConnection() {
    try {
      const generic = new GenericDataSource.default();
      await generic.ping();

      this.app.locals.userService = await new UserService(generic.getClient());
      this.app.locals.authService = await new AuthService(generic.getClient());
      this.app.locals.notificationService = await new NotificationService(
        generic.getClient()
      );
      this.app.locals.incidentService = await new IncidentService(
        generic.getClient()
      );
      this.app.locals.paymentService = await new PaymentService(
        generic.getClient()
      );
      this.app.locals.servicesService = await new ServicesService(
        generic.getClient()
      );

      console.log("DB CONNECTED");
    } catch (error) {
      console.log("[ERROR] [DBCONNECTION] ", error);
    }
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json({ limit: SQL_MAX_SIZE_IMAGE }));
    this.app.use(
      express.urlencoded({
        limit: SQL_MAX_SIZE_IMAGE,
        extended: true,
        parameterLimit: SQL_PARAMETER_LIMIT_IMAGE,
      })
    );
  }

  private routes() {
    this.app.use(Path.AUTH, Auth.default);
    this.app.use(Path.USER, User.default);
    this.app.use(Path.PAYMENT, Payment.default);
    this.app.use(Path.SERVICE, Service.default);
    this.app.use(Path.INCIDENT, Incident.default);
    this.app.use(Path.NOTIFICATION, Notification.default);
    this.app.use(Path.DOCS, Swagger.serve, Swagger.setup(openApiConfig));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Listen on http://localhost:${this.port}`);
    });
  }
}
