/**
 * @summary
 * Main server entry point for GradeBox API.
 * Configures Express application, middleware, routes, and database migrations.
 *
 * @module server
 */

// Load environment variables from .env file (MUST be first import!)
import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware/error';
import { notFoundMiddleware } from '@/middleware/notFound';
import apiRoutes from '@/routes';
import { runDatabaseMigrations } from './migrations/migration-runner';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors(config.api.cors));

// Request processing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes with versioning
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handling
app.use(errorMiddleware);

let server: any;

async function startApplication() {
  try {
    console.log('Checking database migrations...');
    await runDatabaseMigrations({
      skipIfNoNewMigrations: true,
      logLevel: 'minimal',
    });
    console.log('✓ Database ready\n');

    server = app.listen(config.api.port, () => {
      console.log(
        `Server running on port ${config.api.port} in ${process.env.NODE_ENV || 'development'} mode`
      );
      console.log(`API available at http://localhost:${config.api.port}/api/${config.api.version}`);
    });
  } catch (error: any) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startApplication();

export default server;
