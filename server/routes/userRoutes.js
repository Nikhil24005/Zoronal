import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController.js';
import validateUser from '../middleware/validateUser.js';

const router = Router();

router.route('/').get(getUsers).post(validateUser, createUser);

export default router;
