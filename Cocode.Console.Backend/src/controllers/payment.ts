import { Request, Response } from "express";
import { generateFileID, validatePayment } from "../helpers/payment";
import { PaymentService } from "../services";

export const savePayment = async (_req: Request, _res: Response) => {
  try {
    const { userId, amount, month, description, photo, serviceId } = _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const isValidPayment = await validatePayment(
      paymentService,
      userId,
      month,
      serviceId
    );

    if (!isValidPayment) {
      return _res.status(403).json({
        statusCode: 403,
      });
    }

    const filename: string = generateFileID();
    const id = await paymentService.insertRecord({
      month,
      photo,
      userId,
      amount,
      serviceId,
      description,
      recipe: filename,
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

export const getPayments = async (_req: Request, _res: Response) => {
  try {
    const { userId, pageSize = 10, page = 1 } = _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const { data, totalItems, currentPage, totalPages } =
      await paymentService.getRecords(page, pageSize, userId);

    return _res.json({
      data,
      count: totalItems,
      page: currentPage,
      pages: totalPages,
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};
