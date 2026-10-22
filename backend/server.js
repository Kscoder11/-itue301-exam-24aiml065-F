import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import ticketRouter from './routes/ticketRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/tickets', ticketRouter);

// Unknown routes -> structured 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`EventHub server running on port ${PORT}`));
  })
  .catch((connectionError) => {
    console.error('MongoDB connection failed:', connectionError.message);
    process.exit(1);
  });
