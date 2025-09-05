// backend/src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await authService.signupUser(req.body);
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.message.includes('Email already in use')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { user, token } = await authService.loginUser(req.body);
        // Omit password from the response
        const { passwordHash, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword, token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};