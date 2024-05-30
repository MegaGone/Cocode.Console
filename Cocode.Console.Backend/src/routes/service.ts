import { Router } from "express";
import { createService } from "../controllers";
import { createServiceValidationRules } from "../validators";
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

export default router;
