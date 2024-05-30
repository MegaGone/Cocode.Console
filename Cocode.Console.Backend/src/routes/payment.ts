import { Router } from "express";
import { getPayments, savePayment } from "../controllers";
import {
  createPaymentValidationRules,
  getPaymentsValidationRules,
} from "../validators";
import { validateFields, validateJWT, validateRole } from "../middlewares";

const router = Router();

/**
 * @swagger
 * /api/payment/create:
 *   post:
 *     summary: Register payment.
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - amount
 *                - month
 *                - ownerDPI
 *                - description
 *                - photo
 *              properties:
 *               amount:
 *                   type: integer
 *                   description: Amount to pay.
 *                   example: 400
 *               month:
 *                   type: integer
 *                   description: Number of month.
 *                   example: 1
 *               description:
 *                   type: string
 *                   description: Description about the payment.
 *                   example: Swagger test
 *               ownerDPI:
 *                   type: string
 *                   description: DPI number about the owner
 *                   example: 1234567891234
 *               photo:
 *                   type: string
 *                   description: Image in base64 format
 *                   example: base64...
 *               homeAddress:
 *                   type: string
 *                   description: Home Address.
 *                   example: Casa 40
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
 *         description: Unkwon error
 *       422:
 *         description: Fields Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: object
 *                  example: {"errors":[{"field":"ownerDPI","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or is empty."}}]}
 */
router.post(
  "/create",
  createPaymentValidationRules(),
  validateJWT,
  validateRole(3),
  validateFields,
  savePayment
);

/**
 * @swagger
 * /api/payment/payments:
 *   post:
 *     summary: Get payments paginated by owner
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - dpi
 *              properties:
 *               dpi:
 *                   type: string
 *                   description: DPI to filter houses, if you want get all houses remove this property.
 *                   example: 1234567891234
 *               pageSize:
 *                   type: integer
 *                   description: Number of documents per page, by default is 10 documents per page
 *                   example: 15
 *               page:
 *                   type: Integer
 *                   description: Number of page, by default will be the page number 1
 *                   example: 1
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             example:
 *               data: [{"homeAddress":"Casa 1","ownerName":"admin","ownerDPI":"3639933470703","phoneNumber":"24106130","solvent":false}]
 *               count: 10
 *               page: 1
 *               pages: 3
 *               statusCode: 200
 *       404:
 *         description: User not found
 *       422:
 *         description: Fields Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: object
 *                  example: {"errors":[{"field":"dpi","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or is empty."}}]}
 */
router.post(
  "/payments",
  getPaymentsValidationRules(),
  validateJWT,
  validateRole(1, 3),
  validateFields,
  getPayments
);

export default router;
