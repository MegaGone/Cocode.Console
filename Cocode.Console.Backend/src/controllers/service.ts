import { Request, Response } from "express";
import { ServicesService } from "../services";

export const createService = async (_req: Request, _res: Response) => {
  try {
    const { name, budget } = _req.body;

    const service: ServicesService = _req.app.locals.servicesService;

    const isNotValidService = await service.find(name);
    if (isNotValidService) {
      return _res.json({
        statusCode: 400,
      });
    }

    const id = await service.insert({
      Name: name,
      Price: budget,
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

export const findServices = async (_req: Request, _res: Response) => {
  try {
    const { pageSize = 10, page = 1 } = _req.body;
    const { role } = _req;

    const service: ServicesService = _req.app.locals.servicesService;
    const request = await service.findPaginated(page, pageSize, role);

    if (!request) {
      return _res.json({
        statusCode: 400,
      });
    }

    return _res.json({
      services: request?.data,
      statusCode: 200,
      total: request?.totalItems,
      page: request?.currentPage,
      pages: request?.totalPages,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};

export const updateService = async (_req: Request, _res: Response) => {
  try {
    const { id, name, enabled, budget } = _req.body;

    const service: ServicesService = _req.app.locals.servicesService;
    const wasUpdated = await service.update(id, {
      Name: name,
      Price: budget,
      IsEnabled: enabled,
    });

    if (!wasUpdated) {
      return _res.json({
        statusCode: 200,
      });
    }

    return _res.json({
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};
