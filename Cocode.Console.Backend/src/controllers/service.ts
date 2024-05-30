import { Request, Response } from "express";
import { ServicesService } from "../services";

export const createService = async (_req: Request, _res: Response) => {
  try {
    const { name } = _req.body;

    const service: ServicesService = _req.app.locals.servicesService;

    const isNotValidService = await service.find(name);
    if (isNotValidService) {
      return _res.json({
        statusCode: 400,
      });
    }

    const id = await service.insert({
      Name: name,
    });

    return _res.json({
      id,
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};
