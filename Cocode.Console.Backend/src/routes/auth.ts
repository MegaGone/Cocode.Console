import { Router } from "express";

import { getSession, login } from "../controllers";

import { validateFields, validateJWT } from "../middlewares";
import { loginValidatonRules } from "../validators/auth";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login using credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - dpi
 *              properties:
 *               email:
 *                   type: string
 *                   description: User email
 *                   example: john.smith@example.com
 *               dpi:
 *                   type: string
 *                   description: User dpi
 *                   example: 21144245714542
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             example:
 *               x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
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
 *                  example: {"errors":[{"field":"email","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or must be greater than 0."}}]}
 */
router.post("/login", loginValidatonRules(), validateFields, login);

router.get("/session", validateJWT, validateFields, getSession);

export default router;
