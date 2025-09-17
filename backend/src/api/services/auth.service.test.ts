// backend/src/api/services/auth.service.test.ts

import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "./auth.service";
import prismaClient from "../utils/prismaClient";

// Mock the entire prismaClient module
jest.mock("../utils/prismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Mock the libraries
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

// We no longer need the bcryptMock and jwtMock constants.
// We will cast the functions directly in the tests.

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Service", () => {
  describe("signupUser", () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    };
    const hashedPassword = "hashedPassword123";

    test("✅ should create and return a new user successfully", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      // FIX: Explicitly cast the mocked function
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue({
        id: "user_1",
        ...userData,
        passwordHash: hashedPassword,
        riskAppetite: "moderate",
        role: "USER",
      } as any);

      await signupUser(userData);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          passwordHash: hashedPassword,
          riskAppetite: "moderate",
          role: "USER",
        },
      });
    });

    test("❌ should throw an error if email is already in use", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user_1",
        email: userData.email,
      } as any);
      await expect(signupUser(userData)).rejects.toThrow(
        "Email already in use",
      );
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    const credentials = { email: "test@example.com", password: "password123" };
    const mockUser = {
      id: "user_1",
      email: credentials.email,
      passwordHash: "hashedPassword123",
    };
    const mockToken = "mockJwtToken";

    test("✅ should return user and token on successful login", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      // FIX: Explicitly cast the mocked function
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // FIX: Explicitly cast the mocked function
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await loginUser(credentials);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        mockUser.passwordHash,
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    test("❌ should throw an error for a non-existent user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(loginUser(credentials)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    test("❌ should throw an error for an invalid password", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      // FIX: Explicitly cast the mocked function
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser(credentials)).rejects.toThrow(
        "Invalid credentials",
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe("Password Reset", () => {
    test("✅ forgotPassword should update user with reset token", async () => {
      const email = "user@example.com";
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user_1",
        email,
      } as any);
      await forgotPassword(email);
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email },
          data: {
            passwordResetToken: expect.any(String),
            passwordResetExpires: expect.any(Date),
          },
        }),
      );
    });

    test("✅ resetPassword should update password for a valid token", async () => {
      const token = "validToken";
      const newPassword = "newPassword123";
      const hashedPassword = "newHashedPassword";
      const mockUser = { id: "user_1", passwordResetToken: "hashedValidToken" };

      prismaMock.user.findFirst.mockResolvedValue(mockUser as any);
      // FIX: Explicitly cast the mocked function
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await resetPassword(token, newPassword);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          passwordHash: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
    });

    test("❌ resetPassword should throw error for an invalid token", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      await expect(resetPassword("invalidToken", "newPass")).rejects.toThrow(
        "Token is invalid or has expired.",
      );
    });
  });
});
