import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

import {
  SQL_CACHE,
  SQL_DATABASE,
  SQL_HOST,
  SQL_PASSWORD,
  SQl_PORT,
  SQL_USER,
} from "../../config";

import {
  IncidentData,
  PaymentData,
  RoleData,
  UserData,
  NotificationData,
  ServiceData,
  MinuteData,
} from "../entities";

class GenericDataSource {
  private datasource: DataSource;

  constructor() {
    const options: DataSourceOptions = {
      type: "mssql",
      host: SQL_HOST,
      port: +SQl_PORT,
      username: SQL_USER,
      password: SQL_PASSWORD,
      database: SQL_DATABASE,
      cache: SQL_CACHE || SQL_CACHE === "true" ? true : false,
      synchronize: false,
      entities: [
        UserData,
        RoleData,
        PaymentData,
        IncidentData,
        NotificationData,
        ServiceData,
        MinuteData,
      ],
      options: {
        useUTC: true,
      },
      extra: {
        validateConnection: false,
        trustServerCertificate: true,
      },
    };

    this.datasource = new DataSource(options);
  }

  public async ping() {
    try {
      await this.datasource.initialize();
      return "pong";
    } catch (error: any) {
      console.log("[Error] [SQL] Connection Error", error.message);
      return "";
    }
  }

  public getClient() {
    return this.datasource;
  }
}

export default GenericDataSource;
