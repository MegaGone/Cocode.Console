import express, { Application} from "express";
import cors from "cors";
import Swagger from "swagger-ui-express";

import { Auth, User } from '../routes';

import { PORT } from '../config';
import { openApiConfig } from "../documentation";
import { GenericDataSource } from "../database/connection";
import { UserService } from '../services/user.service';

export class Server {
    private app: Application;
    private port: string;

    private paths = {
        auth: "/api/auth",
        docs: "/api/docs",
        user: "/api/user"
    };

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

            console.log('DB CONNECTED')
        } catch (error) {
            console.log('[ERROR] [DBCONNECTION] ',error)
        }
    };

    private middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    };

    private routes() {
        this.app.use(this.paths.auth, Auth.default);
        this.app.use(this.paths.user, User.default);
        this.app.use(this.paths.docs, Swagger.serve, Swagger.setup(openApiConfig));
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Listen on http://localhost:${this.port}`);
        });
    };
};