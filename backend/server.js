import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
// CLIENT_URL holds the allowed front-end URLs separated by commas
app.use(cors({ origin: '*' }));
app.use(express.json());
app.get('/', (q, s) => s.send('RecipeBox API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/recipes/:id/reviews', reviewRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/me', userRoutes);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`API on http://localhost:${process.env.PORT}`));
}).catch(e => console.error(e.message));
