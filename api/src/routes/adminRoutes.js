import express from 'express';
import { resetUserPasswordByEmail } from '../controllers/adminController.js';

const router = express.Router();

router.post('/reset-password-by-email', resetUserPasswordByEmail);

export default router;