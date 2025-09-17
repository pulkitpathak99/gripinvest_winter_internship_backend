// backend/src/api/controllers/profile.controller.ts
import { Request, Response } from "express";
import * as profileService from "../services/profile.service";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await profileService.getUserProfile(
      (req as any).user.id,
    );
    res.json(userProfile);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const handleChangePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = (req as any).user.id;
  try {
    await profileService.changeUserPassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await profileService.updateUserProfile(
      (req as any).user.id,
      req.body,
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userProfile = await profileService.getUserProfile(
      (req as any).user.id,
    );
    const recommendations = await profileService.getAiProfileRecommendations(
      userProfile.riskAppetite,
    );
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};
