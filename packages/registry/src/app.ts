import express from 'express';
import { json } from 'body-parser';
import { componentsRouter } from './routes/components';
import { errorHandler } from './middleware/error';

const app = express();

// Middleware
app.use(json());

// Routes
app.use('/components', componentsRouter);

// Error handling
app.use(errorHandler);

export { app };
