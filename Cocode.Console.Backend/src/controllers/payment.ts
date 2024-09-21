import { Request, Response } from "express";
import { generateFileID, validatePayment } from "../helpers/payment";
import {
  NotificationService,
  PaymentService,
  ServicesService,
  UserService,
} from "../services";
import { deleteFile, getCurrentDate, sanitizeDate } from "../helpers";
import { PDFGenerator } from "../clients";

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

export const approvePayment = async (_req: Request, _res: Response) => {
  try {
    const { paymentId, userId } = _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const payment = await paymentService.findRecord({ id: paymentId });
    if (!payment || payment?.state == 3) {
      return _res.json({
        statusCode: !payment ? 404 : 400,
      });
    }

    const servicesService: ServicesService = _req.app.locals.servicesService;
    const service = await servicesService.findById(payment?.serviceId);
    if (!service) {
      return _res.json({
        statusCode: 404,
      });
    }

    const userService: UserService = _req.app.locals.userService;
    const user = await userService.find({ id: userId });

    const notificationService: NotificationService =
      _req.app.locals.notificationService;
    await notificationService.insertRecord({
      message: `El pago realizado de ${
        service?.Name
      } - ${getCurrentDate()} se ha efectuado correctamente.`,
      user: user?.Email,
      type: 2,
    });

    PDFGenerator.create(
      user?.Dpi!,
      user?.Email!,
      getCurrentDate(),
      payment?.amount,
      user?.DisplayName!,
      service.Name!,
      "TC",
      payment?.recipe
    );

    const wasUpdated = await paymentService.updateStatus(paymentId, {
      state: 2,
    });

    return _res.json({
      updated: wasUpdated,
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};

export const denyPayment = async (_req: Request, _res: Response) => {
  try {
    const { paymentId, userId } = _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const payment = await paymentService.findRecord({ id: paymentId });
    if (!payment || payment?.state == 3) {
      return _res.json({
        statusCode: !payment ? 404 : 400,
      });
    }

    const notificationService: NotificationService =
      _req.app.locals.notificationService;
    const userService: UserService = _req.app.locals.userService;
    const user = await userService.find({ id: userId });

    await notificationService.insertRecord({
      message: `El pago realizado de ${payment?.description} - ${sanitizeDate(
        payment?.payedAt
      )} ha sido rechazado. Hable con el administrador.`,
      user: user?.Email,
      type: 2,
    });

    const wasUpdated = await paymentService.updateStatus(paymentId, {
      state: 3,
    });

    await deleteFile(payment?.recipe);

    return _res.json({
      updated: wasUpdated,
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};

export const cancelPayment = async (_req: Request, _res: Response) => {
  try {
    const { paymentId, userId } = _req.body;

    const paymentService: PaymentService = _req.app.locals.paymentService;
    const payment = await paymentService.findRecord({ id: paymentId });
    if (!payment || payment?.state == 4) {
      return _res.json({
        statusCode: !payment ? 404 : 400,
      });
    }

    const notificationService: NotificationService =
      _req.app.locals.notificationService;
    const userService: UserService = _req.app.locals.userService;
    const user = await userService.find({ id: userId });

    await notificationService.insertRecord({
      message: `El pago realizado de ${payment?.description} - ${sanitizeDate(
        payment?.payedAt
      )} ha sido anulado.`,
      user: user?.Email,
      type: 2,
    });

    const wasUpdated = await paymentService.updateStatus(paymentId, {
      state: 4,
    });

    await deleteFile(payment?.recipe);

    return _res.json({
      updated: wasUpdated,
      statusCode: 200,
    });
  } catch (error) {
    return _res.json({
      statusCode: 500,
    });
  }
};
