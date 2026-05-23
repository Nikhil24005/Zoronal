import mongoose from 'mongoose';

let memoryServerPromise;

async function startMemoryServer() {
  if (!memoryServerPromise) {
    memoryServerPromise = import('mongodb-memory-server').then(async ({ MongoMemoryServer }) => {
      const memoryServer = await MongoMemoryServer.create();
      return memoryServer;
    });
  }

  return memoryServerPromise;
}

async function connectDB(connectionString) {
  mongoose.set('strictQuery', true);
  const localFallback = 'mongodb://127.0.0.1:27017/zoronal';

  const attempts = parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 10;
  const delayMs = parseInt(process.env.DB_RETRY_DELAY_MS, 10) || 5000;

  const uris = [];
  if (connectionString) uris.push(connectionString);
  if (process.env.NODE_ENV !== 'production') uris.push(localFallback);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    for (const uri of uris) {
      try {
        const connection = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${connection.connection.host}`);
        return connection;
      } catch (err) {
        console.warn(`Attempt ${attempt} failed for ${uri}: ${err.message}`);
      }
    }

    if (attempt < attempts) {
      console.log(`Retrying DB connection in ${delayMs}ms (${attempt + 1}/${attempts})...`);
      // eslint-disable-next-line no-await-in-loop
      await sleep(delayMs);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Falling back to an in-memory MongoDB instance for development. Data will not persist between restarts.');
    const memoryServer = await startMemoryServer();
    const memoryUri = memoryServer.getUri('zoronal');
    const connection = await mongoose.connect(memoryUri);
    console.log(`MongoDB connected: ${connection.connection.host} (memory server)`);
    return connection;
  }

  const tried = uris.join(', ');
  const msg = `Unable to establish MongoDB connection after ${attempts} attempts. Tried: ${tried}`;
  console.error(msg);
  throw new Error(msg);
}

export default connectDB;
