import { Router } from "express";

import { createUser, getUser, updateUser } from '../controllers';

import { validateFields } from '../middlewares/validate-fields';
import { createUserValidationRules, getUserValidationRules, updateUserValidationRules } from "../validators";

const router = Router();

router.get(
    '/:userId',
    getUserValidationRules(),
    validateFields,
    getUser
);

router.post(
    '/create',
    createUserValidationRules(),
    validateFields,
    createUser
);

router.put(
    '/update',
    updateUserValidationRules(),
    validateFields,
    updateUser
)

export default router;