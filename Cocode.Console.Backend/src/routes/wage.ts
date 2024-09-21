import { Router } from "express";
import { validateFields, validateJWT, validateRole } from "../middlewares";
import {
  deleteWage,
  findAllWages,
  findWagesPaginated,
  registerWage,
  updateWageStatus,
} from "../controllers";
import {
  deleteWageValidationRules,
  findWagesPaginatedValidationRules,
  registerWageValidationRules,
  updateWageStatusValidationRules,
} from "../validators";

export class WageRouter {
  public static get router(): Router {
    const router = Router();

    router.post(
      "/create",
      validateJWT,
      registerWageValidationRules(),
      validateRole(1),
      validateFields,
      registerWage
    );

    router.put(
      "/status",
      validateJWT,
      updateWageStatusValidationRules(),
      validateRole(1),
      validateFields,
      updateWageStatus
    );

    router.delete(
      "/delete/:id",
      validateJWT,
      deleteWageValidationRules(),
      validateRole(1),
      validateFields,
      deleteWage
    );

    router.post(
      "/findPaginated",
      validateJWT,
      findWagesPaginatedValidationRules(),
      validateRole(1),
      validateFields,
      findWagesPaginated
    );

    router.get(
      "/find",
      validateJWT,
      validateRole(1),
      validateFields,
      findAllWages
    );

    return router;
  }
}
