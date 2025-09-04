// backend/src/api/services/auth.service.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signupUser = async (userData: any) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            passwordHash: hashedPassword,
            riskAppetite: userData.riskAppetite || 'moderate'
        }
    });
    return user;
};

export const loginUser = async (credentials: any) => {
    const user = await prisma.user.findUnique({ where: { email: credentials.email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return { user, token };
};