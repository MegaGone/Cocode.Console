import { Request, Response } from "express";
import { MinuteService } from "../services";

export const createMinute = async (_req: Request, _res: Response) => {
  try {
    const file = _req.file;
    const { user } = _req;
    const { description } = _req.body;

    const minuteService: MinuteService = _req.app.locals.minuteService;

    const id: number = await minuteService.create({
      Author: user?.Email,
      Filename: file?.filename,
      Description: description,
    });

    return _res.status(200).json({
      id,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const disableMinute = async (_req: Request, _res: Response) => {
  try {
    const { id } = _req.params;

    const minuteService: MinuteService = _req.app.locals.minuteService;
    const wasDeleted = await minuteService.delete(+id);

    return _res.status(200).json({
      wasDeleted,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const enableMinute = async (_req: Request, _res: Response) => {
  try {
    const { id } = _req.params;

    const minuteService: MinuteService = _req.app.locals.minuteService;
    const wasEnabled = await minuteService.enable(+id);

    return _res.status(200).json({
      enable: wasEnabled,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const findMinutesPaginated = async (_req: Request, _res: Response) => {
  try {
    const { role } = _req;
    const { pageSize = 10, page = 1 } = _req.body;

    const minuteService: MinuteService = _req.app.locals.minuteService;
    const { data, totalItems, totalPages, currentPage } =
      await minuteService.findPaginated(page, pageSize, +role);

    return _res.status(200).json({
      minutes: data,
      statusCode: 200,
      total: totalItems,
      page: currentPage,
      pages: totalPages,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};
