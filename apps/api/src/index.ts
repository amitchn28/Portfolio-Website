import { app } from './app';
import { env } from './config/env';
import { ensureDatabaseRunning } from './db/embeddedServer';
import prisma from './db/prisma';

async function bootstrap() {
  try {
    // 1. Ensure PostgreSQL is active
    await ensureDatabaseRunning();

    // 2. Test database connection
    await prisma.$connect();
    console.log('✅ [Database] Prisma successfully connected to PostgreSQL');

    // 3. Start Express server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 [API] Server listening on http://localhost:${env.PORT}`);
      console.log(`🩺 [API] Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`🌐 [API] Allowed Web Origin: ${env.CORS_ORIGIN_WEB}`);
      console.log(`🛡️  [API] Allowed Admin Origin: ${env.CORS_ORIGIN_ADMIN}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 [Server] ${signal} signal received: closing server...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ [Server] HTTP server & Prisma disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('❌ [Server] Failed to bootstrap application:', err);
    process.exit(1);
  }
}

bootstrap();
