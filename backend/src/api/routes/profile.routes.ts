// backend/src/api/routes/profile.routes.ts
import { Router } from 'express';
import { getProfile, updateProfile, getRecommendations } from '../controllers/profile.controller';
import { handleChangePassword } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All profile routes are protected
router.use(authMiddleware);
router.put('/change-password', authMiddleware, handleChangePassword);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/recommendations', getRecommendations);

export { router as profileRoutes };