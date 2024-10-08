import { Router } from "express";
import {
  createMinute,
  disableMinute,
  enableMinute,
  findMinutesPaginated,
} from "../controllers";
import { validateFields, validateJWT, validateRole } from "../middlewares";
import { upload } from "../clients";
import {
  disableMinuteValidationRules,
  enableMinuteValidationRules,
  findMinutesValidationRules,
} from "../validators";

export class MinuteRouter {
  public static get router(): Router {
    const router = Router();

    router.post(
      "/create",
      validateJWT,
      upload,
      validateRole(1),
      validateFields,
      createMinute
    );

    router.post(
      "/find",
      validateJWT,
      findMinutesValidationRules(),
      validateFields,
      findMinutesPaginated
    );

    router.delete(
      "/disable/:id",
      validateJWT,
      disableMinuteValidationRules(),
      validateRole(1),
      validateFields,
      disableMinute
    );

    router.put(
      "/enable/:id",
      validateJWT,
      enableMinuteValidationRules(),
      validateRole(1),
      validateFields,
      enableMinute
    );

    return router;
  }
}
