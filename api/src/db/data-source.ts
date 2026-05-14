import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { loadEnv } from '../config/env';

loadEnv();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
