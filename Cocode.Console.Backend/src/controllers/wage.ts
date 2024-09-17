import { Request, Response } from "express";
import { WageService } from "../services";

export const registerWage = async (_req: Request, _res: Response) => {
  try {
    const { description, user, amount, service } = _req.body;

    const wageService: WageService = await _req.app.locals.wageService;
    const id: number = await wageService.create({
      User: user,
      Amount: amount,
      Service: service,
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

export const updateWageStatus = async (_req: Request, _res: Response) => {
  try {
    const { id, status } = _req.body;

    const wageService: WageService = await _req.app.locals.wageService;
    const updated = await wageService.update(id, {
      Status: status,
    });

    return _res.status(200).json({
      updated,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const deleteWage = async (_req: Request, _res: Response) => {
  try {
    const { id } = _req.params;

    const wageService: WageService = await _req.app.locals.wageService;
    const deleted = await wageService.delete(+id);

    return _res.status(200).json({
      deleted,
      statusCode: 200,
    });
  } catch (error) {
    return _res.status(500).json({
      statusCode: 500,
    });
  }
};

export const findWagesPaginated = async (_req: Request, _res: Response) => {
  try {
    const { pageSize = 10, page = 1 } = _req.body;

    const wageService: WageService = await _req.app.locals.wageService;
    const { data, totalItems, totalPages, currentPage } =
      await wageService.findPaginated(page, pageSize);

    return _res.status(200).json({
      wages: data,
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
