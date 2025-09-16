// backend/src/api/controllers/auth.controller.test.ts

import request from 'supertest';
import express from 'express';
import { authRoutes } from '../routes/auth.routes';
import * as authService from '../services/auth.service';
import { User } from '@prisma/client';

// Mock the entire authService module
jest.mock('../services/auth.service');

// Cast the service to a mocked version for type-safe mocking
const authServiceMock = authService as jest.Mocked<typeof authService>;

// Set up a test Express app and use the actual auth routes
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/auth', authRoutes); // Use the real router

describe('Auth Routes Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    const signupData = { email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' };

    test('✅ should return 201 with user and token on successful signup', async () => {
      // --- CORRECTED MOCK DATA ---
      // Create a complete mock user object that matches the 'User' type from Prisma
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hashedpassword',
        riskAppetite: 'moderate',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordResetToken: null,
        passwordResetExpires: null,
      };
      
      const mockLoginResponse = { user: mockUser, token: 'mock-jwt-token' };
      
      authServiceMock.signupUser.mockResolvedValue(mockUser);
      authServiceMock.loginUser.mockResolvedValue(mockLoginResponse);

      const res = await request(app).post('/auth/signup').send(signupData);

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBe('mock-jwt-token');
      expect(authService.signupUser).toHaveBeenCalledWith(signupData);
    });

    test('❌ should return 400 if signup service throws an error', async () => {
      // Arrange: Mock the signupUser service to fail
      authServiceMock.signupUser.mockRejectedValue(new Error('Email already in use'));

      // Act
      const res = await request(app).post('/auth/signup').send(signupData);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already in use');
      expect(authService.loginUser).not.toHaveBeenCalled(); // Ensure login isn't attempted on failure
    });
  });

  describe('POST /auth/login', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };

    test('✅ should return 200 with user and token on successful login', async () => {
        // --- CORRECTED MOCK DATA ---
        // You should also use the full User type here for consistency
        const mockUser: Partial<User> = { id: 'user-1', firstName: 'Test' };
        const mockLoginResponse = { user: mockUser, token: 'mock-jwt-token' };

        // Cast to 'any' here is okay because the service layer strips out sensitive fields
        authServiceMock.loginUser.mockResolvedValue(mockLoginResponse as any);

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(200);
        expect(res.body.token).toBe('mock-jwt-token');
        expect(authService.loginUser).toHaveBeenCalledWith(loginData);
    });
    
    test('❌ should return 401 if login service throws an error', async () => {
      // Arrange
      authServiceMock.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      // Act
      const res = await request(app).post('/auth/login').send(loginData);

      // Assert
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
  
  describe('POST /auth/reset-password', () => {
    test('✅ should return 200 on successful password reset', async () => {
        // Arrange
        authServiceMock.resetPassword.mockResolvedValue();
        const body = { token: 'valid-token', newPassword: 'new-strong-password' };

        // Act
        const res = await request(app).post('/auth/reset-password').send(body);

        // Assert
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Password has been reset successfully.');
        expect(authService.resetPassword).toHaveBeenCalledWith(body.token, body.newPassword);
    });
  });
});