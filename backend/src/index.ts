// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});