// backend/src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const user = await authService.signupUser(req.body);
    // After signup, immediately log them in by generating a token
    const { token } = await authService.loginUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const handleForgotPassword = async (req: Request, res: Response) => {
  try {
    const resetURL = await authService.forgotPassword(req.body.email);
    // In a real app, you'd email this URL. For now, we log it.
    console.log(`Password Reset URL (for development): ${resetURL}`);
    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const handleResetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};