// backend/src/api/routes/auth.routes.ts
import { Router } from 'express';
import { signup, login } from 'api/controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;