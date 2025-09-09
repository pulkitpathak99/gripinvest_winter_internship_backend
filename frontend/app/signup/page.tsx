//frontend/app/signup/page.tsx

"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type RiskAppetite = 'low' | 'moderate' | 'high';
type UserRole = 'USER' | 'ADMIN';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [riskAppetite, setRiskAppetite] = useState<RiskAppetite>('moderate');
  const [role, setRole] = useState<UserRole>('USER'); // default to USER
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        riskAppetite,
        role,
      });

      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      router.push('/dashboard'); // redirect after signup
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Signup failed. Please try again.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  const handleRiskAppetiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRiskAppetite(e.target.value as RiskAppetite);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="riskAppetite">Risk Appetite</label>
          <select
            id="riskAppetite"
            value={riskAppetite}
            onChange={handleRiskAppetiteChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}