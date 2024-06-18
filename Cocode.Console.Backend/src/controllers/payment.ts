import { Request, Response } from "express";
import { getCurrentDate } from "../helpers";
import { validatePayment } from "../helpers/payment";
import {
  NotificationService,
  PaymentService,
  ServicesService,
} from "../services";

export const savePayment = async (_req: Request, _res: Response) => {
  try {
    const { userId, email, amount, month, description, photo, serviceId } =
      _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const notificationService: NotificationService =
      _req.app.locals.notificationService;

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

    const id = await paymentService.insertRecord({
      month,
      photo,
      userId,
      amount,
      serviceId,
      description,
    });

    const service: ServicesService = _req.app.locals.servicesService;
    const { data: services } = await service.findPaginated(1, 50, 3);

    await notificationService.insertRecord({
      message: `El pago realizado de ${
        services[serviceId]?.Name
      } - ${getCurrentDate()} se ha efectuado correctamente.`,
      user: email,
      type: 2,
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
