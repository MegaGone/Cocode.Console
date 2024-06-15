import { Router } from "express";
import { createService, findServices, updateService } from "../controllers";
import {
  createServiceValidationRules,
  updateServiceValidationRules,
  findServiceValidationRules,
} from "../validators";
import { validateFields, validateJWT, validateRole } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/service/create:
 *   post:
 *     summary: Register service.
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *               name:
 *                   type: string
 *                   description: Name about the service to be created.
 *                   example: Agua potable
 *
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               statusCode: 200
 *       400:
 *         description: Service name already exists
 *       422:
 *         description: Fields Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: object
 *                  example: {"errors":[{"field":"name","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or is empty."}}]}
 */
router.post(
  "/create",
  createServiceValidationRules(),
  validateJWT,
  validateRole(1),
  validateFields,
  createService
);

/**
 * @swagger
 * /api/service/find:
 *   post:
 *     summary: Find services paginated.
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - page
 *                - pageSize
 *              properties:
 *               page:
 *                   type: integer
 *                   description: Number of current page.
 *                   example: 1
 *               pageSize:
 *                   type: integer
 *                   description: Number of items per page.
 *                   example: 10
 *
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *            type: object
 *            example: {"services":[{"Id":1, "IsEnabled": true, "Name":"AguaPotable", "CreatedAt": "2024-05-29 23:33:15.090"}], "count": 12, "statusCode": 200}
 *       500:
 *         description: Unknown error
 *       422:
 *         description: Fields Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: object
 *                  example: {"errors":[{"field":"pageSize","message":{"requiredType":"string","warnings":"The field does not exist, is not a integer or is empty."}}]}
 */
router.post(
  "/find",
  findServiceValidationRules(),
  validateJWT,
  validateRole(1),
  validateFields,
  findServices
);

/**
 * @swagger
 * /api/service/update:
 *   put:
 *     summary: Update service.
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - page
 *                - pageSize
 *              properties:
 *               page:
 *                   type: integer
 *                   description: Number of current page.
 *                   example: 1
 *               pageSize:
 *                   type: integer
 *                   description: Number of items per page.
 *                   example: 10
 *
 *     responses:
 *       200:
 *         description: Service updated
 *       400:
 *         description: Error updating service
 *       500:
 *         description: Unknown error
 *       422:
 *         description: Fields Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: object
 *                  example: {"errors":[{"field":"name","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or is empty."}}]}
 */
router.put(
  "/update",
  updateServiceValidationRules(),
  validateJWT,
  validateRole(1),
  validateFields,
  updateService
);

export default router;
