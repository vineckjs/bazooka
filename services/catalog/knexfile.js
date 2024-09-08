module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your-user',
    password: process.env.DB_PASSWORD || 'your-password',
    database: process.env.DB_NAME || 'your-database',
  },
  migrations: {
    directory: './src/infra/database/migrations',
  },
  seeds: {
    directory: './seeds',
  },
};
