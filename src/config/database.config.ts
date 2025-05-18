import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '.';

dotenv.config();

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;