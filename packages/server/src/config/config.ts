import secrets from './secrets';

interface ExpressConfig {
  serverPort: number;
}

const express: ExpressConfig = {
  serverPort: 8080,
};

interface MongoConfig {
  user: string;
  host: string;
  database: string;
  password: string;
}

const mongo: MongoConfig = {
  user: 'admin',
  host: 'cluster0-wrwyj.mongodb.net',
  database: 'reversi-web-db',
  password: secrets.mongoPassword,
};

export {express, mongo};
