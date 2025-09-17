// backend/src/api/routes/auth.routes.ts
import { Router } from "express";
import { handleSignup, handleLogin } from "../controllers/auth.controller";
import {
  handleForgotPassword,
  handleResetPassword,
} from "../controllers/auth.controller";

const router = Router();
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password", handleResetPassword);

// Export the router as a named export called 'authRoutes'
export { router as authRoutes };
