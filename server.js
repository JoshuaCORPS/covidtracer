const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});

const server = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.mssage);

  server.close(process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully.');

  server.close(() => console.log('Process Terminated.'));
});
