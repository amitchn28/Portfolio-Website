import path from 'path';
import net from 'net';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const EmbeddedPostgres = require('embedded-postgres').default || require('embedded-postgres');

const PG_PORT = parseInt(process.env.POSTGRES_PORT || '5432', 10);
const DATA_DIR = path.resolve(__dirname, '../../../../postgres_data');

export async function isPortOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

let activePgInstance: any = null;

export async function ensureDatabaseRunning(): Promise<void> {
  const isRunning = await isPortOpen(PG_PORT);
  if (isRunning) {
    console.log(`✅ [Database] PostgreSQL is already active and listening on port ${PG_PORT}`);
    return;
  }

  console.log(`⏳ [Database] Starting automated local PostgreSQL instance on port ${PG_PORT}...`);
  activePgInstance = new EmbeddedPostgres({
    port: PG_PORT,
    databaseDir: DATA_DIR,
    user: 'postgres',
    password: 'postgresPassword',
    persistent: true,
  });

  try {
    await activePgInstance.start();
    console.log(`🚀 [Database] Local PostgreSQL 18 started successfully on port ${PG_PORT}`);

    // Wait until port is verified open and ready
    for (let i = 0; i < 10; i++) {
      if (await isPortOpen(PG_PORT, '127.0.0.1')) break;
      await new Promise((r) => setTimeout(r, 400));
    }

    // Ensure database exists
    try {
      await activePgInstance.createDatabase('amit_portfolio');
      console.log(`📦 [Database] Database 'amit_portfolio' initialized.`);
    } catch {
      // Database might already exist, safe to ignore
    }
  } catch (err) {
    console.error(`❌ [Database] Failed to start local PostgreSQL:`, err);
    throw err;
  }
}

export async function stopDatabase(): Promise<void> {
  if (activePgInstance) {
    console.log(`🛑 [Database] Stopping local PostgreSQL instance...`);
    await activePgInstance.stop();
    activePgInstance = null;
    console.log(`✅ [Database] PostgreSQL stopped cleanly.`);
  }
}

// Standalone execution support
if (require.main === module) {
  ensureDatabaseRunning()
    .then(() => {
      console.log('PostgreSQL service is running. Press Ctrl+C to stop.');
      process.on('SIGINT', async () => {
        await stopDatabase();
        process.exit(0);
      });
      process.on('SIGTERM', async () => {
        await stopDatabase();
        process.exit(0);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
