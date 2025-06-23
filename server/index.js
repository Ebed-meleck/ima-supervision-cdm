import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { scheduleODKSync } from './cronjobs/odkSync.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'https://your-frontend-domain.com'] 
    : true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create necessary directories
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const tempDir = process.env.TEMP_DIR || 'temp';

fs.ensureDirSync(uploadDir);
fs.ensureDirSync(tempDir);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Entrepot Dashboard API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      uploads: '/uploads'
    }
  });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Schedule cron jobs
    scheduleODKSync();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
      console.log(`⏰ Cron jobs scheduled for midnight and 5 AM daily`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer(); 