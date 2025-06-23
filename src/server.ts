import app from './app';
import { connectDatabase } from './database';
import config from './config';

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(config.port, () =>
      console.log(`🚀 API corriendo en http://localhost:${config.port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
