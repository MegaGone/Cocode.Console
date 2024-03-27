import { Router } from "express";

import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers';

import { validateRole, validateFields, validateJWT } from '../middlewares';
import { createUserValidationRules, getUsersValidationRules, getUserValidationRules, updateUserValidationRules } from "../validators";

const router = Router();

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by Id
 *     tags: [User]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: User ID.
 *       required: true
 *       schema:
 *        type: string
 *     responses:
 *       200:
 *         description:  
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 displayName: John Smith
 *                 role: 2
 *                 email: john.smith@example.com
 *                 createdAt: 2023-03-20 06:00:00.000
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
router.get(
    '/:userId',
    getUserValidationRules(),
    validateJWT,
    validateRole(1),
    validateFields,
    getUser
);

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - FirstName
 *                - LastName
 *                - Email
 *                - Role
 *                - Password
 *              properties:
 *               firstName:
 *                   type: string
 *                   description: First user name.
 *                   example: John
 *               lastName:
 *                   type: string
 *                   description: Last user name.
 *                   example: Smith
 *               role:
 *                   type: Integer
 *                   description: Role Id
 *                   example: 2
 *               email:
 *                   type: string
 *                   description: User email.
 *                   example: john.smith@example.com
 *               password:
 *                   type: string
 *                   description: User password.
 *                   example: 87G!8g3xrF3Hif@H!5&Xx$QkbT8
 *                  
 *     responses:
 *       200:
 *         description:  
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 DisplayName: John Smith
 *                 Role: 2
 *                 Email: john.smith@example.com
 *                 CreatedAt: 2023-03-20 06:00:00.000
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
router.post(
    '/create',
    createUserValidationRules(),
    validateJWT,
    validateRole(1),
    validateFields,
    createUser
);

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - firstName
 *                - lastName
 *                - email
 *                - role
 *                - password
 *              properties:
 *               firstName:
 *                   type: string
 *                   description: First user name.
 *                   example: John
 *               lastName:
 *                   type: string
 *                   description: Last user name.
 *                   example: Smith
 *               role:
 *                   type: Integer
 *                   description: Role Id
 *                   example: 2
 *               email:
 *                   type: string
 *                   description: User email.
 *                   example: john.smith@example.com
 *               password:
 *                   type: string
 *                   description: User password.
 *                   example: 87G!8g3xrF3Hif@H!5&Xx$QkbT8
 *               id:
 *                   type: integer
 *                   example: 1
 *                  
 *     responses:
 *       200:
 *         description:  
 *         content:
 *           application/json:
 *             example:
 *                 statusCode: 200
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
 *                  example: {"errors":[{"field":"id","message":{"requiredType":"integer","warnings":"The field does not exist, is not a integer or must be greater than 0."}}]}
 */
router.put(
    '/update',
    updateUserValidationRules(),
    validateJWT,
    validateRole(1),
    validateFields,
    updateUser
);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by Id
 *     tags: [User]
 *     parameters:
 *     - name: id
 *       in: path
 *       description: User ID.
 *       required: true
 *       schema:
 *        type: string
 *     responses:
 *       200:
 *         description:  
 *         content:
 *           application/json:
 *             example:
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
 *                  example: {"errors":[{"field":"Id","message":{"requiredType":"string","warnings":"The field does not exist, is not a string or must be greater than 0."}}]}
 */
router.delete(
    '/:userId',
    getUserValidationRules(),
    validateJWT,
    validateRole(1),
    validateFields,
    deleteUser
)

/**
 * @swagger
 * /api/user/users:
 *   post:
 *     summary: Get Users paginated
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - roleId
 *              properties:
 *               roleId:
 *                   type: integer
 *                   description: Role Id to filter users, use 0 if you want to match all users..
 *                   example: 1
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
 *               data: [{"DisplayName":"John Smith","Role": 2,"Email": "john.smith@example.com","CreatedAt": "2023-03-20 06:00:00.000"},{"DisplayName":"John Doe","Role": 1,"Email": "john.doe@example.com","CreatedAt": "2023-03-21 06:00:00.000"}]
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
 *                  example: {"errors":[{"field":"roleId","message":{"requiredType":"int","warnings":"The field does not exist, is not a number or must be greater than 0."}}]}
 */
router.post(
    '/users',
    getUsersValidationRules(),
    validateJWT,
    validateRole(1),
    validateFields,
    getUsers
)

export default router;