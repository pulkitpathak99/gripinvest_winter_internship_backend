// backend/src/api/middlewares/auth.middleware.test.ts

import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { authMiddleware, adminMiddleware, AuthRequest } from './auth.middleware';
import prismaClient from '../utils/prismaClient';

// Mock the Prisma client
jest.mock('../utils/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

// Set up a test Express app
const app = express();

// A dummy regular user for our tests
const mockUser = { id: 'user-123', role: 'USER' };
// A dummy admin user
const mockAdmin = { id: 'admin-456', role: 'ADMIN' };

// Create a dummy route protected by authMiddleware
app.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  res.status(200).json({ userId: req.user?.id });
});

// Create a dummy route protected by both authMiddleware and adminMiddleware
app.get('/admin', authMiddleware, adminMiddleware, (req: AuthRequest, res) => {
  res.status(200).json({ userId: req.user?.id });
});

describe('Authentication Middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Set a dummy JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authMiddleware', () => {
    test('❌ should return 401 if no token is provided', async () => {
      const res = await request(app).get('/protected');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Authentication token required');
    });

    test('❌ should return 401 if token is invalid', async () => {
      const res = await request(app).get('/protected').set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid token');
    });

    test('❌ should return 404 if token is valid but user is not found', async () => {
      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET!);
      // Mock Prisma to find no user
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    test('✅ should call next() and attach user to request if token is valid', async () => {
      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET!);
      // Mock Prisma to find the user
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(mockUser.id);
      // We verify that prisma was called, proving the middleware logic ran
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    });
  });

  describe('adminMiddleware', () => {
    test('❌ should return 403 if user is not an admin', async () => {
      const userToken = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET!);
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any); // User is found, but role is 'USER'
      
      const res = await request(app).get('/admin').set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Forbidden: Admin access required');
    });

    test('✅ should call next() if user is an admin', async () => {
      const adminToken = jwt.sign({ userId: mockAdmin.id }, process.env.JWT_SECRET!);
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin as any); // User is found, role is 'ADMIN'
      
      const res = await request(app).get('/admin').set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(mockAdmin.id);
    });
  });
});