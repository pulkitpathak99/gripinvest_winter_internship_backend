// backend/src/api/services/auth.service.ts

import prisma from "../utils/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken, passwordResetExpires },
  });

  // This is the link you would email to the user.
  return `http://localhost:3000/reset-password?token=${resetToken}`;
};

export const resetPassword = async (token: string, newPass: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired.");
  }

  const newPasswordHash = await bcrypt.hash(newPass, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
};

export const signupUser = async (userData: any) => {
  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: hashedPassword,
      riskAppetite: userData.riskAppetite || "moderate",
      role: userData.role || "USER", // default role
    },
  });
  return user;
};

export const loginUser = async (credentials: any) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash,
  );
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return { user, token };
};
