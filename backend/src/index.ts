// backend/src/index.ts (updated)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes';
import productRoutes from './api/routes/product.routes'; // <-- IMPORT
import investmentRoutes from './api/routes/investment.routes'; // <-- IMPORT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // <-- USE
app.use('/api/investments', investmentRoutes); // <-- USE

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});