import { AccessToken } from './../models/access_token.model';
import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/constants/database.constant';
import { Account } from 'src/models/account.model';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const databaseLogger = new Logger('Sequelize');

      databaseLogger.log('Connecting to the database');
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        logging: (...message) => databaseLogger.debug(message),
      });
      sequelize.addModels([Account, AccessToken]);
      await sequelize.sync();

      databaseLogger.log('Successfully connected to the database');
      return sequelize;
    },
  },
];
