import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import recipeRoutes from './routes/recipeRoutes';
import fridgeRoutes from './routes/fridgeRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import historyRoutes from './routes/historyRoutes';


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});


// CORREGIDO: Usando tipos nombrados arriba
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

export default app;
