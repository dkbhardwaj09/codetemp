const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');
const AppError = require('./utils/errors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/ai', aiRoutes);

// Catch-all route for 404 errors
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
