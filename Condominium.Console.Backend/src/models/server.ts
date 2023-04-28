import express, { Application } from "express";
import cors from "cors";
import Swagger from "swagger-ui-express";

import { Auth, Resident, User, Donation, Spreadsheet, Notification, Incident, Visitor } from '../routes';

import { PORT, SQL_MAX_SIZE_IMAGE, SQL_PARAMETER_LIMIT_IMAGE } from '../config';
import { openApiConfig } from "../documentation";
import { GenericDataSource } from "../database/connection";
import { UserService, AuthService, ResidentService, DonationService, SpreadsheetService, NotificationService, IncidentService, VisitorService } from '../services';
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
    };

    private async dbConnection() {
        try {
            const generic = new GenericDataSource.default();
            await generic.ping();

            this.app.locals.userService = await new UserService(generic.getClient());
            this.app.locals.authService = await new AuthService(generic.getClient());
            this.app.locals.residentService = await new ResidentService(generic.getClient());
            this.app.locals.donationService = await new DonationService(generic.getClient());
            this.app.locals.spreadsheetService = await new SpreadsheetService(generic.getClient());
            this.app.locals.notificationService = await new NotificationService(generic.getClient());
            this.app.locals.incidentService = await new IncidentService(generic.getClient());
            this.app.locals.visitorService = await new VisitorService(generic.getClient());

            console.log('DB CONNECTED');
        } catch (error) {
            console.log('[ERROR] [DBCONNECTION] ', error);
        }
    };

    private middlewares() {
        this.app.use(cors());
        this.app.use(express.json({ limit: SQL_MAX_SIZE_IMAGE }));
        this.app.use(express.urlencoded({ limit: SQL_MAX_SIZE_IMAGE, extended: true, parameterLimit: SQL_PARAMETER_LIMIT_IMAGE }))
    };

    private routes() {
        this.app.use(Path.AUTH, Auth.default);
        this.app.use(Path.DONATION, Donation.default);
        this.app.use(Path.DOCS, Swagger.serve, Swagger.setup(openApiConfig));
        this.app.use(Path.INCIDENT, Incident.default);
        this.app.use(Path.NOTIFICATION, Notification.default);
        this.app.use(Path.RESIDENT, Resident.default);
        this.app.use(Path.SPREADSHEET, Spreadsheet.default);
        this.app.use(Path.USER, User.default);
        this.app.use(Path.VISITOR, Visitor.default);
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Listen on http://localhost:${this.port}`);
        });
    };
};