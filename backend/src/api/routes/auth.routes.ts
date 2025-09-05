import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/signup', (req, res, next) => {
  console.log('➡️ Signup route hit');
  return authController.signup(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  console.log('➡️ Login route hit');
  return authController.login(req, res).catch(next);
});

export default router;
